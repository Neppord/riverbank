/* global describe it */
var expect = require('chai').expect
var h = require('highland')
var through = require('through2')

var copy = require('./')

describe('copy', function () {
  it('creates a copie of a stream', function (done) {
    var stream = through.obj()
    stream.write(1)
    stream.end(2)
    var stream_copy = copy(stream)
    h(stream).toArray(function (org) {
      h(stream_copy).toArray(function (cp) {
        expect(cp).to.deep.equal(org)
        done()
      })
    })
  })
})
