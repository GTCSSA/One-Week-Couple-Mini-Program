//https://cloud.tencent.com/developer/article/1380912

const db = wx.cloud.database({});
const cont = db.collection('user');
const app = getApp()
var openid = undefined;
var user_info = undefined;
var cp_info = undefined;


Page({
  data: {
    name: '', cpName: '', cpRate: '', taskArray: undefined, ready: false, myAvatarUrl: '', cpAvatarUrl: ''
  },

  bindViewTap: function (event) {
    wx.navigateTo({
      url: '../firstTask/firstTask?index=' + event.target.id,
    })
  },

  //前往个人信息界面
  viewInfoSelf: function () {
    wx.navigateTo({
      url: '../user_info_display/user_info_display',
    })
  },

  //前往CP信息界面
  viewInfoCP: function () {
    wx.navigateTo({
      url: '../cp_info_final/cp_info_final',
    })
  },

  onLoad: function (options) {

    wx.showLoading({
      title: '加载中...',
    })

    var that = this;

    openid = app.globalData.openid

    user_info = app.globalData.myData
    var cp_openid = user_info.cp;

    that.setData({
      name: user_info.name,
      cpRate: user_info.cp_rate,
      myAvatarUrl: user_info.avatarUrl
    })

    // get cp data
    db.collection('user').where({
      _openid: user_info.cp,
    }).get({
      success: res => {
        cp_info = res.data[0]

        that.setData({
          cpName: cp_info.name,
          cpAvatarUrl: cp_info.avatarUrl
        })

        app.globalData.cpData = res.data[0]
        console.log(globalData.cpData)
      }
    })

    // get tasks
    db.collection('task').get().then(
      res => {
        that.setData({
          taskArray: res.data,
          ready: true
        })
        app.globalData.tasks = res.data

        // Change the color of button if the task is finished
        var taskInfo = app.globalData.myData.taskImages

        var i = 0
        while (i < taskInfo.length) {
          this.data.taskArray[taskInfo[i]].color = "#27a623"
          this.setData({
            taskArray: this.data.taskArray
          })
          i = i + 2
        }
        console.log(this.data.taskArray)
        wx.hideLoading()
      },
    )
  },

  onShow() {
    if (app.globalData.refresh_cp_info) {
      this.refresh()
      app.globalData.refresh_cp_info = false
    }
  },

  refresh() {
    var that = this
    wx.showLoading({
      title: '加载中',
    })
    db.collection('user').where({
      _openid: app.globalData.openid
    }).get().then(
      res => {

        // Change the color of button if the task is finished
        var taskInfo = res.data[0].taskImages
        var i = 0
        while (i < taskInfo.length) {
          that.data.taskArray[taskInfo[i]].color = "#27a623"
          that.setData({
            taskArray: that.data.taskArray
          })
          i = i + 2
        }
        console.log(that.data.taskArray)
        wx.hideLoading()
      }
    )
  },

  onPullDownRefresh: function () {
    this.refresh()
  },
})
