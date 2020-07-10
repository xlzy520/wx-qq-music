const app = getApp()
const api = require("../../../utils/api.js")
Component({
  properties: {
    songs: {
      type: Array,
      value: []
    }
  },
  data: {
    likeMusics: [
        {like: true, _id: 2},
      ]
  },
  onLoad(){
    this.getLikes()
  },
  methods: {
    selectItem: function (e) {
      app.globalData.currentIndex = e.currentTarget.dataset.index
      app.globalData.songlist = this.properties.songs
      console.log(app.globalData.songlist)
      wx.setStorageSync('songlist', this.properties.songs)
      wx.switchTab({
        url: '/pages/player/player'
      })
    },
    onLike(event){
      const { like, music } = event.target.dataset
      if (!like) {
        // type: 1——音乐  2——排行榜  3——歌手
        api.wxCloudCallFunction('add', {
          collectionName: 'favorite',
          music,
          type: 1
        }).then((res) => {
        
        })
      } else {
        api.wxCloudCallFunction('delete', {
          _id: this.data.like[0]._id
  
        }).then((res) => {
        
        }).catch((err) => {
        
        })
      }
    
    },
    getLikes(){
      api.wxCloudCallFunction('getLists', {
        collectionName: 'favorite',
        type: 1
      }).then((res) => {
        app.globalData.likeMusics = res.data
        this.setData({
          likeMusics: res.data
        })
      }).catch((err) => {
     
      })
    }
  }
})
