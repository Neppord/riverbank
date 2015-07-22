/* global describe it */
var expect = require('chai').expect

var h = require('highland')

var river = require('./')

var html = '<html><body><h1>Hello World</h1></body></html>'
var h1 = '<h1>Hello World</h1>'

describe('river', function () {
  it('makes raw templating easy', function (done) {
    var template = river()
    template.end(html)
    h(template).toArray(function (fragments) {
      var text = fragments.join('')
      expect(text).to.deep.equal(html)
      done()
    })
  })
  it('makes finding a sub templates easy', function (done) {
    var template = river().find('h1')
    template.end(html)
    h(template).toArray(function (fragments) {
      var text = fragments.join('')
      expect(text).to.deep.equal(h1)
      done()
    })
  })
})

