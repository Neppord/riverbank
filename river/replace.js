var select = require('html-select')

module.exports = function replace (selector, opts, cb) {
  return select(selector, function (elem) {
    var stream = elem.createStream(opts)
    cb(stream).pipe(stream)
  })
}
