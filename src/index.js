import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
//引入字体图标库
import './assets/fonts/iconfont.css'
//引入 react-virtualized 样式
import 'react-virtualized/styles.css'

import {BrowserRouter} from 'react-router-dom'

ReactDOM.render( 
  <BrowserRouter>
    <App/>
  </BrowserRouter>,
  document.getElementById('root')
);

