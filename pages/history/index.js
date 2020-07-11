const api = require('../../utils/api.js')
Page({
  data: {
    history: [],
    title: ''
  },
  onLoad: function () {
    this.getFavoriteMusicList()
  },
  getFavoriteMusicList () {
    api.wxCloudCallFunction('getLists', {
      collectionName: 'history',
    }).then(res=>{
      this.setData({
        history: res.data.map(v=> v.music),
        title: "播放历史"
      })
    })
  },
})
