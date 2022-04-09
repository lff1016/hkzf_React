import React, { useRef, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { NavBar, Toast } from 'antd-mobile';
import axios from 'axios';

import Map from 'react-bmapgl/Map';
import ScaleControl from 'react-bmapgl/Control/ScaleControl';
import ZoomControl from 'react-bmapgl/Control/ZoomControl';

import './index.scss';
import styles from './index.module.css'

export default function MapPage() {
  const BMapGL = window.BMapGL

  const navigate = useNavigate()

  const [houseList, setHouseList] = useState([])
  const [isShow, setIsShow] = useState(false)
  // 为将来要改变的变量加 ref，确保之后改变值后能获取到最新的值
  const latestIsShow = useRef(false)

  const myMap = useRef()


  const labelStyle = {
    cursor: 'pointer',
    border: '0px solid rgb(255, 0, 0)',
    padding: '0px',
    whiteSpace: 'nowrap',
    fontSize: '12px',
    color: 'rgb(255, 255, 255)',
    textAlign: 'center'
  }

  useEffect(() => {
    initMap()
  }, [])

  // 在useEffect中自动化管理latestIsShow
  useEffect(() => {
    latestIsShow.current = isShow
  })

  // 初始化地图
  function initMap() {
    const map = myMap.current.map
    // 获取当前定位城市
    const { label: city, value } = JSON.parse(localStorage.getItem('hkzf_city'))

    const myGeo = new BMapGL.Geocoder()
    // 解析地址，将结果显示在地图上，并调整缩放级别为11
    myGeo.getPoint(city, async point => {

      if (point) {
        map.centerAndZoom(point, 11)
        // 请求房源数据
        renderOverlays(value)
      } else {
        alert('地址没有解析到结果！')
      }
    }, city)

    // 监听map的 moveStart事件，隐藏房源列表
    map.addEventListener('movestart', () => {
      if(latestIsShow.current) {
        setIsShow(false)
      }
    })
  }

  // 接收 id 获取该城市下区的房源信息，创建文本覆盖物
  async function renderOverlays(id) {
    // 请求数据之前添加 loading 效果
    Toast.show({
      icon: 'loading',
      content: '加载中…',
      duration: 0 // 值为0时，不会自动关闭
    })
    const res = await axios.get(`http://localhost:8080/area/map?id=${id}`)
    // 请求数据结束后，关闭 loading
    Toast.clear()
    const data = res.data.body

    // 调用 getTypeAndZoom() 方法，获取下一级的缩放级别
    const { nextZoom, type } = getTypeAndZoom()

    // 遍历每个数据，创建文本覆盖物
    data.forEach(item => {
      creatOverlays(item, type, nextZoom)
    })

  }

  // 获取房源列表数据
  async function getHouseList(id) {
    Toast.show({
      icon: 'loading',
      content: '加载中…',
      duration: 0 // 值为0时，不会自动关闭
    })
    const res = await axios.get(`http://localhost:8080/houses?cityId=${id}`)
    Toast.clear()
    setHouseList(res.data.body.list)
    setIsShow(true)
  }

  // 计算类型和缩放级别
  function getTypeAndZoom() {
    const map = myMap.current.map
    // 调用 map 实例的 getZoom 方法，获取当前地图的缩放等级
    const zoom = map.getZoom()
    let nextZoom, type

    // 如果当前等级为 11，为区的展示，下一级展示镇---13
    if (zoom >= 10 && zoom < 12) {
      // 区
      nextZoom = 13
      // circle 渲染区和镇的覆盖物
      type = 'circle'
    } else if (zoom >= 12 && zoom < 14) {
      // 如果当前等级为 13，为镇的展示，下一级展示校区小区---15
      nextZoom = 15
      type = 'circle'
    } else if (zoom >= 14 && zoom < 16) {
      // 如果当前等级为 15，为小区的展示
      type = 'rect'
    }
    return {
      nextZoom,
      type
    }
  }

  // 创建覆盖物
  function creatOverlays(data, type, zoom) {
    const {
      coord: { longitude, latitude },
      label: areaName,
      count,
      value
    } = data
    const areaPoint = new BMapGL.Point(longitude, latitude)
    // 根据 type 判断渲染圆形覆盖物还是方形覆盖物
    if (type === 'circle') {
      creatCircle(areaPoint, areaName, count, value, zoom)
    } else {
      creatRect(areaPoint, areaName, count, value)
    }
  }

  // 创建圆形覆盖物
  function creatCircle(point, name, count, id, zoom) {
    const map = myMap.current.map
    // 创建文本覆盖物
    const label = new BMapGL.Label('', {
      position: point,
      offset: new BMapGL.Size(-35, -35)
    })
    // 给 label 添加唯一标识
    label.id = id

    // 设置label的内容
    label.setContent(`
        <div class='${styles.bubble}'>
           <p class='${styles.name}'>${name}</p>
            <p>${count}套</p>
        </div>
      `)
    // 设置 label 的样式
    label.setStyle(labelStyle)

    // 创建覆盖物的点击事件
    label.addEventListener('click', () => {
      // 获取下一级的数据
      renderOverlays(id)
      // 以点击点为中心放大地图
      map.centerAndZoom(point, zoom)
      // 清除覆盖物
      map.clearOverlays()
    })

    // 渲染文本覆盖物到地图
    map.addOverlay(label)
  }

  // 创建方形覆盖物
  // 1. 创建文本标签；2. 绑定单击事件；3. 点击获取小区房源；
  // 4. 展示房源列表；5. 将地图移到中央；6. 监听地图移动，隐藏列表
  function creatRect(point, name, count, id) {
    const map = myMap.current.map
    // 创建文本覆盖物
    const label = new BMapGL.Label('', {
      position: point,
      offset: new BMapGL.Size(-50, -28)
    })
    // 给 label 添加唯一标识
    label.id = id

    // 设置label的内容
    label.setContent(`
        <div class='${styles.rect}'>
          <span class='${styles.housename}'>${name}</span>
          <span class='${styles.housenum}'>${count}套</span>
          <i class='${styles.arrow}'></i>
        </div>
      `)
    // 设置 label 的样式
    label.setStyle(labelStyle)

    // 添加单击事件
    label.addEventListener('click', e => {
      // 获取小区的房源数据
      getHouseList(id)
      // 获取当前被点击项,changedTouches：涉及当前(引发)事件的触摸点的列表
      const target = e.domEvent.changedTouches[0]
      map.panBy(
        window.innerWidth / 2 - target.clientX,
        (window.innerHeight - 330) / 2 - target.clientY
      )
    })

    // 渲染文本覆盖物到地图
    map.addOverlay(label)
  }


  return (
    <div className='map'>
      {/* 头部导航 */}
      <NavBar onBack={() => navigate(-1)} className={styles.nav}>地图找房</NavBar>
      <div id='container'>
        <Map
          ref={myMap}
          style={{ height: '100%' }}
          enableScrollWheelZoom // 是否开启鼠标滚轮缩放
        >
          {/* 添加文本标注 */}
          {/* <Label
            position={new BMapGL.Point(myPoint)}
            text="欢迎使用百度地图GL版"
          /> */}
          {/* 添加比例尺控件 */}
          <ScaleControl />
          {/* 添加缩放控件 */}
          <ZoomControl />
        </Map>
      </div>
      {/* 底部房源列表 */}
      <div className={[styles.houseList, isShow ? styles.show : ''].join(' ')}>
        <div className={styles.titleWrap}>
          <h1 className={styles.listTitle}>房屋列表</h1>
          <Link className={styles.titleMore} to="/home/list">更多房源</Link>
        </div>
        <div className={styles.houseItems}>
          {houseList.map(item => {
            return (
              <div className={styles.house} key={item.houseCode}>
                <div className={styles.imgWrap}>
                  <img
                    className={styles.img}
                    src={`http://localhost:8080${item.houseImg}`}
                    alt=""
                  />
                </div>
                <div className={styles.content}>
                  <h3 className={styles.title}>{item.title}</h3>
                  <div className={styles.desc}>{item.desc}</div>
                  <div>
                    {/* ['近地铁', '随时看房'] */}
                    {item.tags.map((tag, index) => {
                      const tagClass = 'tag' + (index + 1)
                      return (
                        <span
                          className={[styles.tag, styles[tagClass]].join(' ')}
                          key={tag}
                        >
                          {tag}
                        </span>
                      )
                    })}
                  </div>
                  <div className={styles.price}>
                    <span className={styles.priceNum}>{item.price}</span> 元/月
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
