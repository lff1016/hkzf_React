import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { NavBar,Toast } from 'antd-mobile';
import { AutoSizer, List } from 'react-virtualized';

// 获取utils中的获取当前城市的方法
import { getCurrentCity } from '../../utils';
import './index.scss';
import styles from './index.module.css'

export default function CityList() {
  // 设置数据状态
  const [cityList, setCityList] = useState({})
  const [cityListIndex, setCityListIndex] = useState([])
  const [activeIndex, setActiveIndex] = useState(0)

  const ListCompent = useRef()

  // 设置行高
  const HEIGHT_NAV = 36
  const HEIGHT_ITEM = 50

  // 定义已有房源的城市数组
  const houseCity = ['北京', '上海', '广州', '深圳']

  // 编程式导航
  const navigate = useNavigate()

  // 格式化城市列表数据
  /*
  list: {label: '北京', value: 'AREA|88cff55c-aaa4-e2e0', pinyin: 'beijing', short: 'bj'}
  格式化： cityList: {a: [], b: [], ...}
  */
  function formatCity(list) {
    const cityList = {}
    list.forEach(item => {
      //取出首字母
      const first = item.short.slice(0, 1)
      //判断
      if (cityList[first]) {
        cityList[first].push(item)
      } else {
        cityList[first] = [item]
      }
    })

    //获取键值
    const cityListIndex = Object.keys(cityList).sort()

    return {
      cityList,
      cityListIndex
    }
  }

  // 格式化首字母
  function formatLetter(letter) {
    switch (letter) {
      case '#':
        return '当前城市'
      case 'hot':
        return '热门城市'
      default:
        return letter.toUpperCase()
    }
  }
  // 挂载时获取城市列表
  useEffect(async () => {
    const getCityList = async () => {

      const res = await axios.get('http://localhost:8080/area/city?level=1')
      //处理返回的城市列表格式
      const { cityList, cityListIndex } = formatCity(res.data.body)

      //请求热门城市
      const hotCities = await axios.get('http://localhost:8080/area/hot')
      //将数据添加到cityList中
      cityList['hot'] = hotCities.data.body

      // 获取当前城市列表
      const curCity = await getCurrentCity()
      cityList['#'] = [curCity]
      cityListIndex.unshift('#', 'hot')

      //修改数据状态
      setCityList(cityList)
      setCityListIndex(cityListIndex)
    }
    await getCityList()

    // 获取到城市列表数据后调用 measureAllRows 方法，提前计算好每一行的高度
    // 但请求数据是异步操作，当 list 无数据时会报错
    ListCompent.current.measureAllRows()
  }, [])

  // 渲染列表的 render 函数
  function rowRenderer({ key, index, style }) {
    //根据自带的索引获取每一行的字母
    const letter = cityListIndex[index]

    return (
      <div key={key} style={style} className='city'>
        <div className='title'>{formatLetter(letter)}</div>
        {
          cityList[letter].map(item => <div className='name' key={item.value} onClick={() => changeCity(item)}>{item.label}</div>)
        }
      </div>
    );
  }

  // 点击获取城市信息并跳转
  function changeCity({label, value}) {
    // 如果有房源信息，就保存在本地储存
    if(houseCity.indexOf(label) > -1) {
      localStorage.setItem('hkzf_city', JSON.stringify({label, value}))
      navigate(-1)
    } else {
      // 如果没有，就弹出警告框
      Toast.show({
        content: '抱歉！没有该位置的房源信息'
      })
    }
  }

  // 计算每个索引项下的高度
  // 索引高度 + 城市数量 * 城市高度 
  function getRowHeight({ index }) {
    return HEIGHT_NAV + HEIGHT_ITEM * cityList[cityListIndex[index]].length
  }

  // 渲染侧边索引栏函数
  function renderCityIndex() {
    // 获取 cityIndex来渲染
    return cityListIndex.map((item, index) => (
      // 调用 List 组件的 scrollToRow 方法，先获取 List 节点
      <li className='city-index-item' key={item} onClick={() => {ListCompent.current.scrollToRow(index); console.log(index); } } >
        <span className={activeIndex === index ? 'index-active' : ''}>
          {item === 'hot' ? '热' : item.toUpperCase()}
        </span>
      </li>
    ))
  }

  // 侧边栏高亮  
  function onRowsRendered({ startIndex }) {
    if(activeIndex !== startIndex) {
      setActiveIndex(startIndex)
    }
  }

  return (
    <div className='cityList'>
      {/* 1.头部导航栏 */}
      <NavBar onBack={() => navigate(-1)} className={styles.nav}>城市列表</NavBar>
      {/* 2.长列表 */}
      <AutoSizer>
        {({ height, width }) => (
          // 城市列表区
          <List
            ref = {ListCompent}
            width={width}
            height={height}
            rowCount={cityListIndex.length}
            rowHeight={getRowHeight}
            rowRenderer={rowRenderer}
            onRowsRendered={onRowsRendered}
            scrollToAlignment='start'
          />
        )}
      </AutoSizer>
      {/* 侧边导航区 */}
      <ul className='city-index'>{renderCityIndex()}</ul>
    </div>
  )
}
