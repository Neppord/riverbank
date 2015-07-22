var duplexer = require('duplexer2')

var find_stream = require('./find')
var start_stream = require('./start')
var end_stream = require('./end')

module.exports = function () {
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

  return self
}
