/**
 * author: Di (微信小程序开发工程师)
 * organization: WeAppDev(微信小程序开发论坛)(http://weappdev.com)
 *               垂直微信小程序开发交流社区
 * 
 * github地址: https://github.com/icindy/wxParse
 * 
 * for: 微信小程序富文本解析
 * detail : http://weappdev.com/t/wxparse-alpha0-1-html-markdown/184
 */

/**
 * utils函数引入
 **/
import showdown from './showdown.js';
import HtmlToJson from './html2json.js';
/**
 * 配置及公有属性
 **/
/**
 * 主函数入口区
 **/
function wxParse(bindName = 'wxParseData', type = 'html', data = '<div class="color:red;">数据不能为空</div>', target, imagePadding) {
  var that = target;
  var transData = {};//存放转化后的数据
  if (type == 'html') {
    transData = HtmlToJson.html2json(data, bindName);
  } else if (type == 'md' || type == 'markdown') {
    var converter = new showdown.Converter();
    var html = converter.makeHtml(data);
    transData = HtmlToJson.html2json(html, bindName);
  }
  transData.view = {};
  transData.view.imagePadding = 0;
  if (typeof (imagePadding) != 'undefined') {
    transData.view.imagePadding = imagePadding
  }
  var bindData = {};

  bindData[bindName] = transData;

  that.setData(bindData)
  that.wxParseImgLoad = wxParseImgLoad;
  that.wxParseImgTap = wxParseImgTap;
}
// 图片点击事件
function wxParseImgTap(e) {
  var that = this;
  var nowImgUrl = e.target.dataset.src;
  var tagFrom = e.target.dataset.from;
  var idx = e.target.dataset.idx;
  if (typeof (tagFrom) != 'undefined' && tagFrom.length > 0) {
    my.previewImage({
      current: idx,
      urls: that.data[tagFrom].imageUrls,

    })
  }
}

/**
 * 图片视觉宽高计算函数区 
 **/
function wxParseImgLoad(e) {
  var that = this;
  var tagFrom = e.target.dataset.from;
  var idx = e.target.dataset.idx;
  if (typeof (tagFrom) != 'undefined' && tagFrom.length > 0) {
    calMoreImageInfo(e, idx, that, tagFrom)
  }
}
// 假循环获取计算图片视觉最佳宽高
function calMoreImageInfo(e, idx, that, bindName) {
  var temData = that.data[bindName];
  if (temData.images.length == 0) {
    return;
  }
  var temImages = temData.images;
  let originalWidth = e.detail.width
  let originalHeight = e.detail.height
  //获取图片的原始长宽
  var windowWidth = 0, windowHeight = 0;
  var autoWidth = 0, autoHeight = 0;
  let a = 0
  let b = 0
  my.getSystemInfo({
    success: function (res) {
      var padding = that.data[bindName].view.imagePadding;
      windowWidth = res.windowWidth - 2 * padding;
      windowHeight = res.windowHeight;
      //判断按照那种方式进行缩放

      if (originalWidth > windowWidth) {//在图片width大于手机屏幕width时候 
        autoWidth = windowWidth;

        autoHeight = (autoWidth * originalHeight) / originalWidth;

        a = autoWidth;
        b = autoHeight;
      } else {//否则展示原来的数据
        a = originalWidth;
        b = originalHeight;
      }
      console.log(a)
      console.log(b)
      temImages[idx].width = a;
      temImages[idx].height = b;
      temData.images = temImages;
      var bindData = {};
      bindData[bindName] = temData;

      that.setData(bindData);
    }
  })


}


function wxParseTemArray(temArrayName, bindNameReg, total, that) {
  var array = [];
  var temData = that.data;
  var obj = null;
  for (var i = 0; i < total; i++) {
    var simArr = temData[bindNameReg + i].nodes;
    array.push(simArr);
  }

  temArrayName = temArrayName || 'wxParseTemArray';
  obj = JSON.parse('{"' + temArrayName + '":""}');
  obj[temArrayName] = array;
  that.setData(obj);
}

/**
 * 配置emojis
 * 
 */

function emojisInit(reg = '', baseSrc = "/wxParse/emojis/", emojis) {
  HtmlToJson.emojisInit(reg, baseSrc, emojis);
}

module.exports = {
  wxParse: wxParse,
  wxParseTemArray: wxParseTemArray,
  emojisInit: emojisInit
}


