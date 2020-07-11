const app = getApp().globalData
const util = require('../../../utils/util.js')
const api = require('../../../utils/api.js')

Component({
  data: {
    zIndex: 50,
    hasFavorite: false,
    likePlayList: []
  },
  properties: {
    title: {
      type: String,
      value: 'Chicken Music',
      observer: function (newVal) {
        this._setTitle(newVal)
      }
    },
    image: {
      type:String,
      value: '',
      observer: function (newVal) {
        this.setData({
          bgStyle: `background-image:url(${newVal})`
        })
      }
    },
    songs: {
      type: Array,
      value: []
    },
    type: {
      type: Number,
      value: 2
    }
  },
  ready: function () {
    this.setSonglistTop()
    this._setTitle(this.properties.title)
    console.log(this.properties.title)
    // 动态设置歌手头像背景图
    this.setData({
      bgStyle: `background-image:url(${this.properties.image})`
    })
  },
  attached() {
    this.getLikePlayList()
  },
  methods: {
    /*针对不同手机设置songlist的top值*/
    setSonglistTop: function () {
      const _this = this
      wx.createSelectorQuery().in(this).select('#bgImage').boundingClientRect((rect) => {
        rect.height
      }).exec((res) => {
        _this.setData({
          top: res[0].height,
          oldTop: res[0].height //记录原始的top值
        })
      })
    },
    _setTitle: function (title) {
      wx.setNavigationBarTitle({
        title: title
      })
    },
    scroll: function (e) {
      let top = this.data.oldTop - e.detail.scrollTop > 0 ? this.data.oldTop - e.detail.scrollTop : 0
      const percent = Math.abs(e.detail.scrollTop / this.data.oldTop)
      if (e.detail.scrollTop > 20) {
        this.setData({
          zIndex: 0,
          bgZindex: 0
        })
      } else if (e.detail.scrollTop < 20 && e.detail.scrollTop > 0) {
        this.setData({
          zIndex: 50,
          bgZindex: 0
        })
      } else if (e.detail.scrollTop < 0) {
        this.setData({
          scale: `scale(${1 + percent})`,
          translate: `transform:translate3d(0px,${Math.abs(e.detail.scrollTop)}px,0px)`,
          bgZindex: 1,
          zIndex: 50
        })
        return
      }
      this.setData({
        top: top
      })
    },
    randomPlayall: function () {
      app.currentIndex = util.randomNum(this.properties.songs.length)
      app.songlist = this.properties.songs
      wx.switchTab({
        url: '/pages/player/player'
      })
    },
    
    addFavorite(){
      const type = this.properties.type
      let music = {}
      if (type === 2) {
        music = app._selectItemRank
      } else if (type === 3) {
        music = app.selectsinger
      }
      const hasFavorite = this.data.hasFavorite
      const name = hasFavorite ? 'delete': 'add'
      const data = {
        collectionName: 'favorite',
        type
      }
      if (hasFavorite) {
        const id = music.id
        data._id = this.data.likePlayList.find(f => f.music.id === id)._id
      } else {
        data.music = music
      }
      api.wxCloudCallFunction(name, data).then((res) => {
        this.getLikePlayList()
      })
      
    },
    getLikePlayList(){
      const type = this.properties.type
      api.wxCloudCallFunction('getLists', {
        collectionName: 'favorite',
        type
      }).then((res) => {
        const likePlayList = res.data
        let id;
        if (type === 2) {
          id = app.topId
        } else if (type === 3) {
          id = app.selectsinger.id
        }
        const hasFavorite = likePlayList.findIndex(f=> f.music.id === id) > -1
        this.setData({
          hasFavorite,
          likePlayList
        })
      })
    },
    /*向父组件推送滚动到底部的事件*/
    getMoreSongs: function () {
      this.triggerEvent('myevent', this.properties.songs.length)
    }
  }
})
