import { Navigate } from "react-router-dom";

import Home from '../pages/Home';
// import Index from '../pages/Index';
// import News from '../pages/News';
// import MyInfo from '../pages/MyInfo';
// import List from '../pages/HouseList';
import Map from '../pages/Map';
import Sale from '../pages/Sale';
import CityList from '../pages/CityList';
import Search from '../pages/Search';

const routers =  [
  {
    path: '/',
    element: <Navigate to='/home'/>
  },
  {
    path: '/home/*',
    element: <Home/>,
    // children: [
    //   {
    //     path: 'list',
    //     element: <List/>,
    //   },
    //   {
    //     path: 'news',
    //     element: <News/>,
    //   },
    //   {
    //     path: 'my',
    //     element: <MyInfo/>
    //   },
    //   {
    //     path: 'sale',
    //     element: <Sale/>
    //   }
    // ]
  },
  {
    path: '/cityList',
    element: <CityList/>
  },
  {
    path: '/search',
    element: <Search/>
  },
  {
    path: '/map',
    element: <Map/>
  }
]

export default routers
