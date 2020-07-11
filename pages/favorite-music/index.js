const api = require('../../utils/api.js')
Page({
  data: {
    favoriteMusicList: [],
    title: ''
  },
  onLoad: function () {
    this.getFavoriteMusicList()
  },
  getFavoriteMusicList () {
    api.wxCloudCallFunction('getLists', {
      collectionName: 'favorite',
      type: 1
    }).then(res=>{
      this.setData({
        favoriteMusicList: res.data.map(v=> v.music),
        title: "我喜欢的音乐"
      })
    })
  },
})
