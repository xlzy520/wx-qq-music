const app = getApp().globalData
const api = require('../../utils/api.js')
const song = require('../../utils/song.js')
Page({
  data: {
    topList: [],
  },
  onShow() {
    this.getFavoriteRankList()
  },
  getFavoriteRankList () {
    api.wxCloudCallFunction('getLists', {
      collectionName: 'favorite',
      type: 2
    }).then(res=>{
      console.log(res);
      this.setData({
        topList: res.data.map(v=> v.music),
      })
    })
  },
  _selectItemRank: function (event) {
    const data = event.currentTarget.dataset.data
    app.topId = data.id
    app._selectItemRank = data
    wx.navigateTo({
      url: '/pages/top-list/top-list'
    })
  },
})
