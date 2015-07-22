var through = require('through2')
module.exports = function () {
  return through.obj(push_second_index)
}

function push_second_index (token, enc, next) {
  this.push(token[1])
  next()
}
