'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var baseReg = exports.baseReg = function baseReg(v) {
  var g = /base64.\S+/;
  var str = v.match(g)[0];
  str = str.substr(0, str.length - 2);
  str = str.replace('base64,', '');
  return str;
};