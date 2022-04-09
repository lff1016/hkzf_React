import React from 'react';
import { Badge, TabBar } from 'antd-mobile';
import {
  useNavigate,
  useLocation,
} from 'react-router-dom';
// import routers from '../../routers';
//引入tabbar样式
import './tabbar.css';
import styles from './style.less'

const Bottom = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { pathname } = location

  //页面的重定向
  const setRouteActive = (value) => {
    console.log(value);
    navigate(value)
  }

  // tab项目
  const tabs = [
    {
      key: '/home',
      title: '首页',
      icon: <i className='iconfont icon-ind'></i>,
      badge: Badge.dot,
    },
    {
      key: '/home/list',
      title: '找房',
      icon: <i className='iconfont icon-findHouse'></i>,
      badge: '5',
    },
    {
      key: '/home/news',
      title: '资讯',
      icon: <i className='iconfont icon-infom'></i>,
      badge: '99+',
    },
    {
      key: '/home/my',
      title: '我的',
      icon: <i className='iconfont icon-my'></i>,
    },
  ]

  return (
    <div className='tab-bar'>
      <TabBar activeKey={pathname} onChange={value => setRouteActive(value)}>
        {tabs.map(item => (
          <TabBar.Item key={item.key} icon={item.icon} title={item.title} />
        ))}
      </TabBar>
    </div>
  )

}

export default () => {
  return (
      <>
        <div className={styles.bottom}>
          <Bottom />
        </div>
      </>
  )
}