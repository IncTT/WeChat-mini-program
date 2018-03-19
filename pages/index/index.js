//index.js
const util = require('../../utils/math.min.js')

const app = getApp()
const sentence = ['我爱你!', 'I Love You!', 'あなたのことが好きです!', 'Je t\'aime ．'];

function random() {
  return Math.floor(Math.random() * 4 );
}

Page({
  data: {
    motto: null,
    hasSentence: false,
    btn_reset_display: 'none'
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  getSentence: function () {
    this.setData({
      motto: sentence[random()],
      hasSentence: true,
      btn_reset_display: 'true'
    })
  },
  reset: function () {
    this.setData({
      motto: null,
      hasSentence: false,
      btn_reset_display: 'none'
    })
  }
})
