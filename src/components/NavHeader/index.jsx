import React from 'react';
import { NavBar } from 'antd-mobile'

export default function NavHeader() {
  return (
    <div className=''>
      <NavBar onBack={() => navigate(-1)} className='nav'>城市列表</NavBar>
    </div>
  )
}
