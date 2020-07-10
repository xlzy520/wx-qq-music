const app = getApp().globalData
const api = require('../../utils/api.js')
const song = require('../../utils/song.js')
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
    
    }).then(res=>{
      console.log(res);
    })
    // api.getTopMusicList(app.topId).then((res)=>{
    //   var res1 = res.data.replace('jp1(', '')
    //   var res2 = JSON.parse(res1.substring(0, res1.length - 1))
    //   console.log(res2.topinfo.ListName)
    //   this.setData({
    //     topList: this._normalizeSongs(res2.songlist),
    //     title: res2.topinfo.ListName
    //   })
    // })
  },
  _normalizeSongs:function(list) {
    let ret = []
    list.forEach((item) => {
      const musicData = item.data
      if (musicData.songid && musicData.albummid) {
        ret.push(song.createSong(musicData))
      }
    })
    return ret
  }
})
