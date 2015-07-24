var through = require('through2')
module.exports = function () {
  var stream = through.obj(push_second_index)
  stream.isClosed = true
  return stream
}

function push_second_index (token, enc, next) {
  this.push(token[1])
  next()
}
