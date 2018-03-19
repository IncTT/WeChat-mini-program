// calc.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    result: '0',
    temp: '',
    symbol_flag: false,
    last_symbol: '',
    add_sub_flag: false,
    last_num: '0'
  },

  /**
   * 按钮点击事件
   */

  clickButton: function (e) {
    var btn_value = e.target.dataset.value; //获得计算器按钮的data-value用以区分按钮用途
    var data = this.data.result;//计算器显示的结果
    var temp = this.data.temp;//计算器临时计算公式
    var symbol_flag = this.data.symbol_flag;//计算器是否输入过运算符
    var last_symbol = this.data.last_symbol;//计算器上一个输入的运算符
    var add_sub_flag = this.data.add_sub_flag;//计算器是否输入过+或-
    var last_num = this.data.last_num;//计算器上一个输入的数字

    if (btn_value >= 0 && btn_value <= 9) { //判断计算器数字按钮
      if (this.data.result == '0') {//当前值为0时输入数字替换0
        data = btn_value;
      } else {//当前值不为0时在后面增加新数字，最大长度13位
        if (data.replace(/,/g, '').replace('.', '').length < 13) {
          data += btn_value;
        }
      }
      last_num = data;
      data = formatNum(data);
    } else if (btn_value == 'cencel') { //判断计算器CE，当前值重置0
      data = '0';
    } else if (btn_value == 'clear') {//判断计算器C，将当前值和temp公式重置
      data = '0';
      temp = '';
    } else if (btn_value == 'back') { //判断计算器←，删除当前数字最后一位，只有一位是，置0
      if (data.length > 1) {
        data = data.substring(0, data.length - 1);
      } else {
        data = '0';
      }
    } else if (btn_value == 'negative') { //判断计算器±，当前值正负颠倒
      data = data.replace(/,/g, '')
      data = (data * -1).toString();
      data = formatNum(data);
    } else if (btn_value == 'dot') { //判断计算器.
      if (data.indexOf('.') == -1) {
        data += '.';
      }
    } else if (btn_value == 'equ') { //判断计算器=
      temp += formatNum(data)
      console.log(temp);
      data = calculate(temp);
      temp = '';
    } else {
      symbol_flag = true;
      if (btn_value == 'div') { //判断计算器÷
        temp += data + '÷';
        last_symbol = '÷';
      } else if (btn_value == 'mul') { //判断计算器×
        temp += data + '×';
        last_symbol = '×';
      } else if (btn_value == 'sub') { //判断计算器-
        temp += data + '-';
        last_symbol = '-';
        add_sub_flag = true;
      } else if (btn_value == 'add') { //判断计算器+
        temp += data + '+';
        last_symbol = '+';
        add_sub_flag = true;
      }
      temp = temp.replace(/,/g, '');
      data = 0;
    }
    this.setData({
      result: data,
      temp: temp,
      symbol_flag: symbol_flag,
      last_symbol: last_symbol,
      add_sub_flag: add_sub_flag,
      last_num: last_num
    })
  }
})

function formatNum(num) {
  num = num.replace(/,/g, '');//去掉千分位符号，方便操作
  var newNum = '';
  var count = 0;
  var negativeFlag = false;//是否为负数
  if (num.indexOf('-') >= 0) {
    negativeFlag = true;
    num = num.substring(1);
  }
  if (num.indexOf('.') == -1) {//没有小数点的情况
    for (var i = num.length - 1; i >= 0; i--) {
      if (count % 3 == 0 && count != 0) {//从右往左隔3位增加千分位符号
        newNum = num.charAt(i) + ',' + newNum;
      } else {
        newNum = num.charAt(i) + newNum;
      }
      count++;
    }
  } else {
    for (var i = num.indexOf('.') - 1; i >= 0; i--) {
      if (count % 3 == 0 && count != 0) {//从右往左隔3位增加千分位符号
        newNum = num.charAt(i) + ',' + newNum
      } else {
        newNum = num.charAt(i) + newNum;
      }
      count++;
    }
    newNum += num.substring(num.indexOf('.'));//最后加上小数点后的数字
  }
  if (negativeFlag) {//是负数最后加上负号
    newNum = '-' + newNum;
  }
  return newNum;
}

function calculate(str) {//取运算符和运算符两边的数字进行计算，计算完成后从运算符数组中移除运算符，并用结果替换到原来数字数组中的两个数字，splice(i,n,v)函数可以使用v元素替换掉从i开始的n个元素
  var nums = getNum(str);
  var symbols = getSymbol(str);
  
  for (var i = 0; i < symbols.length; i++) {//先处理乘法和除法
    var num1 = nums[i];
    var num2 = nums[i + 1];
    var ops = symbols[i];
    if (ops == '×' || ops == '÷') {
      console.log(i+ops);
      var value = getResult(num1, ops, num2);      
      nums.splice(i, 2, value.toString());
      symbols.splice(i,1);
      i--;
    }
  }
  for (var i = 0; i < symbols.length; i++) {//再处理加法和减法
    var num1 = nums[i];
    var num2 = nums[i + 1];
    var ops = symbols[i];
    if (ops == '-' || ops == '+') {
      var value = getResult(num1, ops, num2);
      nums.splice(i, 2, value.toString());
      symbols.splice(i, 1);
      i--;
    }
  }
  return nums[0];
}

function change(str) {//判断运算式中的负号，并用@代替方便后续操作  
  for (var i = 0; i < str.length; i++) {
    if (i == 0 && str.charAt(i) == '-') {//运算式第一位是'-'则一定是负号
      str = '@' + str.substring(i + 1);
    }
    if ((str.charAt(i) == '×' && str.charAt(i + 1) == '-') || (str.charAt(i) == '÷' && str.charAt(i + 1) == '-') || (str.charAt(i) == '+' && str.charAt(i + 1) == '-') || (str.charAt(i) == '-' && str.charAt(i + 1) == '-')) {//跟在任何运算符后面的'-'都是负号
      str = str.substring(0, i + 1) + '@' + str.substring(i + 2);
    }
  }
  return str;
}

function getNum(str) {//从算式中提取数字并按顺序放入数组
  var newStr = change(str);
  var strSplit = newStr.split(/[\+\-\×\÷]/);//使用运算符号切分字符串
  var nums = new Array();
  for (var i = 0; i < strSplit.length; i++) {
    nums[i] = strSplit[i].replace('@', '-');
  }
  return nums;
}

function getSymbol(str) {//从算式中提取运算符号
  var newStr = change(str);
  var strSplit = newStr.split(/[0-9\.\@]/);//使用数字、小数点还有用来替换负号的@切分字符串
  var symbols = new Array();
  var count = 0;
  for (var i = 0; i < strSplit.length; i++) {
    if (strSplit[i] == '+' || strSplit[i] == '-' || strSplit[i] == '×' || strSplit[i] == '÷') {
      symbols[count] = strSplit[i];
      count++;
    }
  }
  return symbols;
}

function getResult(num1, ops, num2) {//根据运算符号ops计算两个数字的运算结果
  var result = 0;
  var length1 = 0;
  var length2 = 0;
  var length = 0;
  if (num1.indexOf('.') != -1) {
    length1 = num1.substring(num1.indexOf('.') + 1).length;
  }
  if (num2.indexOf('.') != -1) {
    length2 = num2.substring(num2.indexOf('.') + 1).length;
  }
  switch (ops) {
    case '+':
      length = (length1 > length2) ? length1 : length2;
      result = (num1 * 1 + num2 * 1).toFixed(length);
      break;
    case '-':
      length = (length1 > length2) ? length1 : length2;
      result = (num1 * 1 - num2 * 1).toFixed(length);
      break;
    case '×':
      length = length1 + length2;
      result = (num1 * 1 * num2 * 1).toFixed(length);;
      break;
    case '÷':
      length = length1 + length2;
      result = (num1 * 1 / num2 * 1).toFixed(length);;
      break;
  }
  return result;
}