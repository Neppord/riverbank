var select = require('html-select')
var duplexer = require('duplexer2')
var through = require('through2')

module.exports = function find (selector, opts) {
  var p = through.obj(function (obj, enc, next) {
    this.push(obj)
    next()
  })
  var s = select(selector, function (elem) {
    elem.createReadStream().pipe(p)
  })
  return duplexer(s, p)
}
