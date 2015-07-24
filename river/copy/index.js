var through = require('through2')
module.exports = copy

function copy (stream) {
  var ret = through.obj()
  ret.pause()
  stream.pipe(ret)
  return ret
}
