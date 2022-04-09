import axios from "axios";

// 封装获取当前城市的函数
export const getCurrentCity = () => {
  // 判断 LocalStorge 中是否保存了定位城市
  const localCity = JSON.parse(localStorage.getItem('hkzf_city'))
  if (!localCity) {
    // 如果没有，就调用接口获取定位城市，并保存在 localStorge 中
    return new Promise((resolve, reject) => {
      const curCity = new window.BMapGL.LocalCity()
      try {
        curCity.get(async res => {
        const result = await axios.get(`http://localhost:8080/area/info?name=${res.name}`)
         // 存储到本地
         localStorage.setItem('hkzf_city', JSON.stringify(result.data.body))
         // 返回异步获取的数据
         resolve(result.data.body)
        })
      
      } catch(e) {
        reject(e)
      }
     })
  }
  // 如果本地存储中有，则直接返回数据
  return Promise.resolve(localCity)
}

// 节流函数
// export const throttle = function(fn, delay) {
//   const pre = Date.now()
//   return function() {
//     const context = this
//     const args = arguments
//     const now = Date.now()
//     if(now - pre >= delay) {
//       fn.apply(context, args)
//       pre = Date.now()
//     }
//   }
// }