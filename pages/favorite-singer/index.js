const app = getApp().globalData
const api = require('../../utils/api.js')
const song = require('../../utils/song.js')
Page({
  data: {
    singerlist: [],
  },
  onShow () {
    this.getFavoriteSingerList()
  },
  getFavoriteSingerList () {
    api.wxCloudCallFunction('getLists', {
      collectionName: 'favorite',
      type: 3
    }).then(res=>{
      this.setData({
        singerlist: res.data.map(v=> v.music),
      })
    })
  },
  toSingerDetail: function (event) {
    const app = getApp()
    app.globalData.selectsinger = event.currentTarget.dataset.singer
    wx.navigateTo({
      url: '/pages/singer-detail/singer-detail'
    })
  },

})
