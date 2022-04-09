  // 挂载时，组件创建地址解析器实例
  useEffect(() => {
    const myGeo = new BMapGL.Geocoder()
    // 解析地址，将结果显示在地图上，并调整缩放级别为11
    myGeo.getPoint(city, async point => {
      const map = myMap.current.map
      if (point) {
        map.centerAndZoom(point, 11)
        // 请求房源数据
        renderOverlays(value)
      } else {
        alert('地址没有解析到结果！')
      }
    }, city)
  // 为每一条房源数据渲染覆盖物
  res.data.body.forEach((item) => {
    const {
      coord: { longitude, latitude },
      label: areaName,
      count,
      value
    } = item

    const areaPoint = new BMapGL.Point(longitude, latitude)
    // 创建文本覆盖物
    const label = new BMapGL.Label('', {
      position: areaPoint,
      offset: new BMapGL.Size(-35, -35)
    })
    // 给 label 添加唯一标识
    label.id = value

    // 设置label的内容
    label.setContent(`
        <div class='${styles.bubble}'>
           <p class='${styles.name}'>${areaName}</p>
            <p>${count}套</p>
        </div>
      `)
    // 设置 label 的样式
    label.setStyle(labelStyle)

    // 创建覆盖物的点击事件
    label.addEventListener('click', () =>{
      // 以点击点为中心放大地图
      map.centerAndZoom(areaPoint, 13)
      // 清除覆盖物
      map.clearOverlays()
    })

    // 渲染文本覆盖物到地图
    map.addOverlay(label)
  })