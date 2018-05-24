'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _index = require('../../../_lib/buildFormatLongFn/index.js');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var formatLong = (0, _index2.default)({
  LT: 'HH:mm',
  LTS: 'HH:mm:ss',
  L: 'YYYY年MM月DD日',
  LL: 'YYYY年MMMMD日',
  LLL: 'YYYY年MMMMD日 HH:mm',
  LLLL: 'YYYY年MMMMD日 dddd HH:mm'
});

exports.default = formatLong;
module.exports = exports['default'];