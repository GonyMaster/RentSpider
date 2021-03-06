"use strict";

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var checkIp = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
    var obj1, result, ipAdress;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            obj1 = {};
            _context.prev = 1;
            _context.next = 4;
            return superagent.get("http://127.0.0.1:3000/getIP");

          case 4:
            result = _context.sent;

            console.log("result.headers:" + JSON.parse(result.text));
            //  var ipAdress = JSON.parse(result.text)[0].ip+':'+JSON.parse(result.text)[0].port ;
            ipAdress = JSON.parse(result.text);
            // console.log("正在获取IP列表: " + ipAdress);

            return _context.abrupt("return", ipAdress);

          case 10:
            _context.prev = 10;
            _context.t0 = _context["catch"](1);

            console.error(_context.t0);

          case 13:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this, [[1, 10]]);
  }));

  return function checkIp() {
    return _ref.apply(this, arguments);
  };
}();

var getInfo = function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
    var objArr;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return checkIp();

          case 2:
            objArr = _context2.sent;

            async.mapLimit(objArr, 15, function (obj, callback) {
              var userAgent = userAgents[parseInt(Math.random() * userAgents.length)];
              var ip = "http://" + obj.ip + ":" + obj.port;
              // var ip = "http://127.0.0.1:1080";

              superagent.get("https://xj.58.com") //这里设置编码
              .set({ "User-Agent": userAgent }).proxy(ip).timeout({ response: 4000 }).end(function (err, res) {
                var curip = obj.ip;
                if (err) {
                  curNum++;
                  curErrNum++;
                  console.log("ip:  " + ip + "无效,继续抓取!", "\n错误信息:" + err + "\n当前有效IP:" + successNum + "个" + "\n当前无效IP:" + curErrNum + "个" + "\n当前总共检查IP:" + curNum + "个\n" + "ip存活率:" + _common.Common.toPercent(successNum / curNum) + "\n==================================================");

                  insert(curip, 0);
                  callback(null);
                  return;
                }

                curNum++;
                successNum++;
                console.log("====================================");
                console.log("检测到有效IP,地址是: " + ip + "\n当前有效IP数量: " + successNum + "\n当前总共检查IP:" + curNum + "个\n" + "ip存活率:" + _common.Common.toPercent(successNum / curNum));
                console.log("====================================");
                insert(curip, 3);
                callback(null, true);
              });
            }, function (error, results) {
              if (successNum >= targetNum) {
                console.log("有效目标:" + targetNum + "到了! 结束检查");
                return;
              }
              console.log("抓取目标:" + successNum + "个,开始下一轮!");
              getInfo();
            });

          case 4:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function getInfo() {
    return _ref2.apply(this, arguments);
  };
}();

var _common = require("../until/common");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

/**
 *
 * 代理池信息抓取
 *
 */

var cheerio = require("cheerio"); //可以像jquer一样操作界面
var charset = require("superagent-charset"); //解决乱码问题:
var superagent = require("superagent"); //发起请求
var requestProxy = require("superagent-proxy"); //发起请求

var async = require("async"); //异步抓取
var moment = require("moment");
var xiciInfo = require("../../schema/xc.js");
var request = require("request");
var xml2js = require("xml2js");
var userAgents = require("../../until/userAgent"); //浏览器头

// var eventproxy = require('eventproxy');  //流程控制
// var ep = eventproxy();
var baiduAK = "MfZGTw9zGqS8PbmjVN66IrbDGmI9SVM8";
var pageNum = 1;
var curNum = 0;
var curErrNum = 0;
var successNum = 0;
var targetNum = 2000;
var baseUrl = "http://www.xicidaili.com/"; //信息
var type = "nn"; // nt:国内透明  nn:国内高匿
requestProxy(superagent);
charset(superagent);
moment.locale("zh-cn");

function insert(obj, type) {
  if (!type) {
    xiciInfo.deleteMany({ 'ip': obj, 'eff': type }).exec(function (err, data) {

      if (err) {
        console.log(err);
      }
      console.log('删除了标识为0的记录:' + obj);
    });
    xiciInfo.deleteMany({ 'ip': obj, 'eff': { $exists: false } }).exec(function (err, data) {

      if (err) {
        console.log(err);
      }
      console.log(data);
    });
    console.log('删除了不存在exists标识的记录:' + obj);
  } else {
    xiciInfo.update({ 'ip': obj }, { $set: { 'eff': type } }).exec(function (err, data) {
      if (err) {
        console.log(err);
      }
      console.log('将ip:' + obj + '的eff更新为了' + type);
    });
  }
}

getInfo();