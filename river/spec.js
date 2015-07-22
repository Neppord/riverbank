/* global describe it */
var expect = require('chai').expect

var h = require('highland')

var river = require('./')
var start_stream = require('./start')

var html = '<html><body><h1>Hello World</h1></body></html>'
var h1 = '<h1>Hello World</h1>'
var hello_riverbank = '<html><body><h1>Hello Riverbank</h1></body></html>'

describe('river', function () {
  it('makes raw templating easy', function (done) {
    var template = river(html)
    h(template).toArray(function (fragments) {
      var text = fragments.join('')
      expect(text).to.deep.equal(html)
      done()
    })
  })
  it('makes finding a sub templates easy', function (done) {
    var template = river()
    template.find('h1')
    template.end(html)
    h(template).toArray(function (fragments) {
      var text = fragments.join('')
      expect(text).to.deep.equal(h1)
      done()
    })
  })
  it('makes replacing a subtemplate easy', function (done) {
    var template = river()
    template.replace('h1', function (subtemplate) {
      return h(['<h1>Hello Riverbank</h1>']).pipe(start_stream())
    })
    template.end(html)
    h(template).toArray(function (fragments) {
      var text = fragments.join('')
      expect(text).to.deep.equal(hello_riverbank)
      done()
    })
  })
})

