/* global describe it */
var expect = require('chai').expect

var h = require('highland')
var through = require('through2')

var river = require('./')

var html = '<html><body><h1>Hello World</h1></body></html>'
var h1 = '<h1>Hello World</h1>'
var hello_riverbank = '<html><body><h1>Hello Riverbank</h1></body></html>'
var pet_template = (
  '<div class="pet">' +
  '<h1 class="pet-name"></h1>' +
  '<div class="pet-type"></div>' +
  '<div class="pet-age"></div>' +
  '</div>'
)
var fluffy_puff_html = (
  '<div class="pet">' +
  '<h1 class="pet-name">Fluffy Puff</h1>' +
  '<div class="pet-type">Rabbit</div>' +
  '<div class="pet-age">3</div>' +
  '</div>'
)

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
  it('makes replacing a element easy', function (done) {
    var template = river()
    template.replace('h1', function (subtemplate) {
      return river.open_right('<h1>Hello Riverbank</h1>')
    })
    template.end(html)
    h(template).toArray(function (fragments) {
      var text = fragments.join('')
      expect(text).to.deep.equal(hello_riverbank)
      done()
    })
  })
  it('makes replacing content of elements easy', function (done) {
    var template = river()
    template.replace.inner('h1', function (subtemplate) {
      return river.open_right('Hello Riverbank')
    })
    template.end(html)
    h(template).toArray(function (fragments) {
      var text = fragments.join('')
      expect(text).to.deep.equal(hello_riverbank)
      done()
    })
  })
  it('makes replacing multiple of content easy', function (done) {
    var template = river(pet_template)
    template.replace.inner('.pet-name', function () {
      return river.open_right('Fluffy Puff')
    })
    template.replace.inner('.pet-type', function () {
      return river.open_right('Rabbit')
    })
    template.replace.inner('.pet-age', function () {
      return river.open_right('3')
    })
    h(template).toArray(function (fragments) {
      var text = fragments.join('')
      expect(text).to.deep.equal(fluffy_puff_html)
      done()
    })
  })
  it.skip('makes mapping over data with a template easy', function (done) {
    var template = river(pet_template)
      .map(function (t, data) {
        return t.replace.inner('.pet-name', function () {
          return river.open_right(data.name)
        }).replace.inner('.pet-type', function () {
          return river.open_right(data.type)
        }).replace.inner('.pet-age', function () {
          return river.open_right(data.age.toString())
        })
      })
    pet_stream().pipe(template)
    h(template).toArray(function (fragments) {
      var text = fragments.join('')
      expect(text).to.deep.equal(fluffy_puff_html)
      done()
    })
  })
})

function pet_stream () {
  var stream = through.obj()
  stream.end({name: 'Fluffy Puff', type: 'Rabbit', age: 3})
  return stream
}
