// Home组件：只包含底部导航栏的
import React from 'react';
import { Outlet } from 'react-router-dom';
import TabBar from '../../components/TabBar/TabBar';



export default function Home() {
  return (
    <div className='Home'>
      {/* 渲染子路由 */}
      <Outlet/>
      {/* 引入TabBar */}
      <TabBar />
    </div>
  )
}
