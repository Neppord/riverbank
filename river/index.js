var duplexer = require('duplexer2')
var through = require('through2')

var find_stream = require('./find')
var replace_stream = require('./replace')
var start_stream = require('./start')
var end_stream = require('./end')

var river = closed
river.closed = closed
river.open = open
river.open_right = river.closed_left = open_right
river.open_left = river.closed_right = open_left

module.exports = river

function _river (start, end) {
  var last = start
  var self = duplexer(start, end)

  start.pipe(end)

  self.find = function find (selector) {
    push(find_stream(selector))
    return self
  }

  self.replace = function replace (selector, cb) {
    push(replace_stream.outer(selector, cb))
    return self
  }

  self.replace.inner = function replace (selector, cb) {
    push(replace_stream.inner(selector, cb))
    return self
  }

  function push (stream) {
    last.unpipe(end)
    last = last.pipe(stream)
    last.pipe(end)
  }

  return self
}

function closed (text) {
  var river = _river(start_stream(), end_stream())
  if (text) river.end(text)
  return river
}

function open_right (text) {
  var river = _river(start_stream(), through.obj())
  if (text) river.end(text)
  return river
}

function open () {
  return _river(through.obj(), through.obj())
}

function open_left () {
  return _river(through.obj(), end_stream())
}
