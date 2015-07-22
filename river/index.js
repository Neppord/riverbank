var duplexer = require('duplexer2')
var tokenizer = require('html-tokenize')
var through = require('through2')

var find_stream = require('./find')

module.exports = function () {
  var last
  var t = last = tokenizer()
  var s = through.obj(function (token, enc, next) {
    this.push(token[1])
    next()
  })
  var self = duplexer(t, s)

  t.pipe(s)

  self.find = function find (selector) {
    last.unpipe(s)
    last = last.pipe(find_stream(selector))
    last.pipe(s)
    return self
  }

  return self
}
