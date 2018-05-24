'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = formatRelative;
var formatRelativeLocale = {
  lastWeek: '[上]dddd LT',
  yesterday: '[昨天]LT',
  today: '[今天]LT',
  tomorrow: '[明天]LT',
  nextWeek: 'ddddLT',
  other: 'L'
};

function formatRelative(token, date, baseDate, options) {
  return formatRelativeLocale[token];
}
module.exports = exports['default'];