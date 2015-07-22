var through = require('through2')

module.exports = map

function map (template, callback) {
  return through.obj(function (obj, enc, next) {
    var self = this
    var results = callback(template, obj)
    results.on('data', function (data) {
      self.push(data)
    })
    results.on('end', function (data) {
      if (data) self.push(data)
      next()
    })
  })
}
