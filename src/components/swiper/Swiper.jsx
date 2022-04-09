import React, { useState, useEffect } from 'react';
import { Swiper } from 'antd-mobile';
import axios from 'axios'

import './swiper.css'

// 获取每个轮播图项目的回调
function getItems(swipers) {
  return swipers.map((item) => (
    <Swiper.Item key={item.id}>
      <img className='content' src={`http://localhost:8080${item.imgSrc}`} style={{ width: '100%' }}/>
    </Swiper.Item>))
}

export default () => {

  //定义state
  const [swipers, setSwiper] = useState([])
  // const [isLoading, setIsLoading] = useState(false)

  // 在组件挂载时请求数据
  useEffect(() => {
    const  getSwipers = async () => {
      const res = await axios.get('http://localhost:8080/home/swiper')
      setSwiper(res.data.body)
    }
    getSwipers()
  }, [])

  if (getItems(swipers).length !== 0) {
    return (
      <div className='top-swiper'>
        <Swiper
          autoplay
          loop
          indicatorProps={{
            style: {
              '--active-dot-color': '#8c8882',
              '--dot-size': '8px',
              '--active-dot-size': '8px',
              '--dot-border-radius': '50%',
              '--active-dot-border-radius': '50%',
              '--dot-spacing': '8px',
            }
          }}
          style={{ '--height': '212px' }}
        >
          {getItems(swipers)}
        </Swiper>
      </div>
    )
  } else {
    return (
      <div>Loading....</div>
    )
  }
};