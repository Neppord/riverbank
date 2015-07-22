/* global describe it */
var expect = require('chai').expect
var h = require('highland')
var through = require('through2')
var map = require('./map')
describe('map', function () {
  it('conactinates the returned streams', function (done) {
    var data = through.obj()
    data.write(1)
    data.end(1)
    var template = map(through.obj(), function () {
      return h(['x'])
    })
    h(data.pipe(template)).toArray(function (arr) {
      var text = arr.join('')
      expect(text).to.deep.equal('xx')
      done()
    })
  })
})
