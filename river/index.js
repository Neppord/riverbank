var through = require('through2')

// Need to export before we include if they include us
module.exports = river
river.parse = parse
river.mixin = mixin

var find_stream = require('./find')
var replace_stream = require('./replace')
var parse_stream = require('./start')
var end_stream = require('./end')
var map_stream = require('./map')

function mixin (self) {
  self.find = function find (selector) {
    return mixin(self.pipe(find_stream(selector)))
  }
  self.render = function render () {
    return mixin(self.pipe(end_stream()))
  }
  self.replace = function replace (selector, cb) {
    return mixin(self.pipe(replace_stream.outer(selector, cb)))
  }
  self.replace.inner = function replace_inner (selector, cb) {
    return mixin(self.pipe(replace_stream.inner(selector, cb)))
  }
  self.map = function map (callback) {
    return mixin(map_stream(self, callback))
  }
  return self
}

function parse (text) {
  var river = mixin(parse_stream())
  if (text) river.end(text)
  return river
}

function river (text) {
  var river = mixin(through.obj())
  if (text) river.end(text)
  return river
}
