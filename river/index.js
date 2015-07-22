var duplexer = require('duplexer2')
var through = require('through2')

// Need to export before we include if they include us
module.exports = closed

var find_stream = require('./find')
var map_stream = require('./map')
var replace_stream = require('./replace')
var start_stream = require('./start')
var end_stream = require('./end')

var river = closed
river._river = _river
river.closed = closed
river.open = open
river.open_right = river.closed_left = open_right
river.open_left = river.closed_right = open_left

function _river (start, end) {
  var last = start
  var self = duplexer(start, end)

  start.pipe(end)

  self.find = function find (selector) {
    add_before_end(find_stream(selector))
    return self
  }

  self.replace = function replace (selector, cb) {
    add_before_end(replace_stream.outer(selector, cb))
    return self
  }

  self.replace.inner = function replace (selector, cb) {
    add_before_end(replace_stream.inner(selector, cb))
    return self
  }

  self.map = function map (callback) {
    var stream = map_stream(self.open_right(), callback)
    return _river(stream, end_stream())
  }

  self.open_right = function open_right () {
    last.unpipe(end)
    end.end()
    return _river(last, through.obj())
  }

  function add_before_end (stream) {
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
