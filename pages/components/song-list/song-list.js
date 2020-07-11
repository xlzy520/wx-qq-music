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
    likeMusicIds: []
  },
  attached(){
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
          const newData = [...this.data.likeMusicIds, music.id]
          app.globalData.likeMusics.push({
            _id: res._id,
            music: {
              id: music.id
            }
          })
          this.setData({
            likeMusicIds: newData
          })
        })
      } else {
        const _id = app.globalData.likeMusics.find(value => value.music.id === music.id)._id
        api.wxCloudCallFunction('delete', {
          _id,
          collectionName: 'favorite',
        }).then((res) => {
          const index = this.data.likeMusicIds.findIndex(f=> f === music.id)
          this.data.likeMusicIds.splice(index, 1)
          const newData = this.data.likeMusicIds
          this.setData({
            likeMusicIds: newData
          })
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
          likeMusicIds: res.data.map(v=> v.music.id)
        })
      }).catch((err) => {
     
      })
    },
  }
})
