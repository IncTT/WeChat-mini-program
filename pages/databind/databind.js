//databind.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    content: '微信小程序数据绑定',
    hiddencontent: '隐藏的内容',
    flag: false,
    num1: 1,
    num2: 2,
    user: [
      {
        name: '张三',
        age: 18
      }, {
        name: '李四',
        age: 18
      }, {
        name: '王五',
        age: 18
      }
    ]
  },
  tapName: function (e) {
    console.log(e);
  }
})