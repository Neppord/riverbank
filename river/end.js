var through = require('through2')
module.exports = function () {
  return through.obj(pass_trhough)
}

function pass_trhough (token, enc, next) {
  this.push(token[1])
  next()
}
