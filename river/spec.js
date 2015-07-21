/* global describe it */
var expect = require('chai').expect
var river = require('./')

var html = '<html></html>'
var html_buffer = new Buffer(html)

describe('river', function () {
  var template = river()
  it('makes raw templating easy', function (done) {
    template.end(html)
    template.once('readable', function () {
      expect(template.read()).to.deep.equal(html_buffer)
      done()
    })
  })
})

