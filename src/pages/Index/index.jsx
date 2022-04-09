import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Grid } from 'antd-mobile';

import Swiper from '../../components/swiper/Swiper';
import { getCurrentCity } from '../../utils'

import './index.scss';

//导入图片
const imgsName = ['nav-1', 'nav-2', 'nav-3', 'nav-4']
const imgs = imgsName.map(item => require('../../assets/images/' + item + '.png'))

export default function Index() {
  // 创建导航菜单对象
  const navs = [
    {
      id: '1',
      img: imgs[0],
      title: '整租',
      path: '/list'
    },
    {
      id: '2',
      img: imgs[1],
      title: '合租',
      path: '/list'
    },
    {
      id: '3',
      img: imgs[2],
      title: '地图找房',
      path: '/map'
    },
    {
      id: '4',
      img: imgs[3],
      title: '去出租',
      path: '/sale'
    }
  ]

  //创建 grounp state
  const [grounps, setGrounps] = useState([])
  //创建 news state
  const [news, setNews] = useState([])
  //创建当前城市的state
  const [curCityName, setCurCityName] = useState('')

  const [isLoding, setIsLoading] = useState(false)

  // 组件挂载时请求grounp数据
  useEffect(() => {
    const getGrounps = async () => {
      setIsLoading(true)
      const res = await axios.get('http://localhost:8080/home/groups', {
        params: {
          area: 'AREA%7C88cff55c-aaa4-e2e0'
        }
      })
      setGrounps(res.data.body)
      setIsLoading(false)
    }
    getGrounps()
  }, [])

  //组件挂载时请求news数据
  useEffect(() => {
    const getNews = async () => {
      const res = await axios.get('http://localhost:8080/home/news', {
        params: {
          area: 'AREA%7C88cff55c-aaa4-e2e0'
        }
      })
      setNews(res.data.body)
    }
    getNews()
  }, [])

  //组件挂载时请求用户的地理位置信息
  useEffect(() => {
    // 调用 utils 的获取当前城市的接口
    const getCity = async () => {
      const curCity = await getCurrentCity()
      setCurCityName(curCity.label)
    }
    getCity()
  },[])


  //使用编程式导航
  let navigate = useNavigate();
  function handleClick(path) {
    navigate(path);
  }

  return (
    <div className='main-home'>
       {/* 0.顶部搜索 */}
       <div className='search'>
          <div className='search-content'>
            <div className='location' onClick={() => navigate('/cityList')}>
              <span>{curCityName}</span>
              <i className='iconfont icon-arrow'></i>
            </div>
            <div className='search-form' onClick={() => navigate('/search')}>
              <i className='iconfont icon-seach'></i>
              <span className='text'>请输入小区或地址</span>
            </div>
          </div>
          <div className='map-icon' onClick={() => navigate('/map')}>
            <i className='iconfont icon-map'></i>
          </div>
        </div>
        {/* 1. 轮播图 */}
        <Swiper />
        {/* 2.导航菜单 */}
        <div className='guideMeun'>
          {
            navs.map(item => {
              return (
                <div className='guideMeun-item' key={item.id} onClick={() => handleClick(item.path)}>
                  <img src={item.img} alt="" />
                  <h4>{item.title}</h4>
                </div>
              )
            })
          }
        </div>
        {/* 3.租房小组nav */}
        <div className='grounp-nav'>
          <h4 className='grounp-title'>
            租房小组
            <span className='more'>更多</span>
          </h4>
        </div>
        {/* 4.租房小组内容 */}
        <div className='grounp-content'>
          <Grid columns={2} gap={12}>
            {
              isLoding ? (
                <div>Loading....</div>
              ) : (
                grounps.map(item => {
                  return (
                    <Grid.Item key={item.id}>
                      <div className='grid-item'>
                        <div className='desc'>
                          <p className='title'>{item.title}</p>
                          <span className='info'>{item.desc}</span>
                        </div>
                        <img src={`http://localhost:8080${item.imgSrc}`} alt="" />
                      </div>
                    </Grid.Item>
                  )
                })
              )
            }
          </Grid>
        </div>
        {/* 5.最新资讯 */}
        <div className='news'>
          <div className='news-nav'>
            <p>最新资讯</p>
          </div>
          {
            news.map(item => {
              return (
                <div className='news-content' key={item.id}>
                  <img src={`http://localhost:8080${item.imgSrc}`} alt="" />
                  <div className='news-desc'>
                    <h4>{item.title}</h4>
                    <div className='news-info'>
                      <span className='news-from'>{item.from}</span>
                      <span className='news-publishTime'>{item.date}</span>
                    </div>
                  </div>
                </div>
              )
            })
          }

        </div>
    </div>
  )
}

