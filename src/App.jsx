import { Route, Routes, Navigate } from 'react-router-dom';
import CityList from './pages/CityList';
import Map from './pages/Map';
import Search from './pages/Search';
import Home from './pages/Home';
import Index from './pages/Index';
import News from './pages/News';
import HouseList from './pages/HouseList';
import MyInfo from './pages/MyInfo';
//引入路由表
// import routers from './routers';

export default function App() {
  // 定义路由表
  // const element = useRoutes(routers)
  return (
    <div className="App">
      {/* 使用路由表
       {element} */}
      <Routes>
        {/* 1.渲染首页及其子路由页面 */}
        <Route path='/home' element={<Home />}>
          {/* 1.1渲染子路由 */}
          <Route exact path='/home' element={<Index />}></Route>
          <Route path='/home/news' element={<News />}></Route>
          <Route path='/home/list' element={<HouseList />}></Route>
          <Route path='/home/my' element={<MyInfo />}></Route>
        </Route>
        {/* 3.渲染城市列表页面 */}
        <Route path='/cityList' element={<CityList />}></Route>
        {/* 4.渲染地图找房页面 */}
        <Route path='/map' element={<Map />}></Route>
        {/* 5.渲染搜索界面 */}
        <Route path='/search' element={<Search />}></Route>
        {/* 2.重定向到 home 页 */}
        <Route path='/' element={<Navigate to='/home' />}></Route>
      </Routes>
    </div>
  );
}

