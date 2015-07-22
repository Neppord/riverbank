var duplexer = require('duplexer2')

var find_stream = require('./find')
var replace_stream = require('./replace')
var start_stream = require('./start')
var end_stream = require('./end')

module.exports = function (text) {
  var last
  var start = last = start_stream()
  var end = end_stream()
  var self = duplexer(start, end)

  start.pipe(end)

  self.find = function find (selector) {
    last.unpipe(end)
    last = last.pipe(find_stream(selector))
    last.pipe(end)
    return self
  }
  self.replace = function replace (selector, cb) {
    last.unpipe(end)
    last = last.pipe(replace_stream(selector, {}, cb))
    last.pipe(end)
    return self
  }
  if (text) self.end(text)
  return self
}
