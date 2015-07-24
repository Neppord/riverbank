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
    var template = river.parse(html)
    h(template.render()).toArray(function (fragments) {
      var text = fragments.join('')
      expect(text).to.deep.equal(html)
      done()
    })
  })
  it('makes finding a sub templates easy', function (done) {
    var template = river.parse(html)
     .find('h1')
    h(template.render()).toArray(function (fragments) {
      var text = fragments.join('')
      expect(text).to.deep.equal(h1)
      done()
    })
  })
  it('makes replacing a element easy', function (done) {
    var template = river.parse(html)
      .replace('h1', function (subtemplate) {
        return river.parse('<h1>Hello Riverbank</h1>')
      })
    h(template.render()).toArray(function (fragments) {
      var text = fragments.join('')
      expect(text).to.deep.equal(hello_riverbank)
      done()
    })
  })
  it('makes replacing content of elements easy', function (done) {
    var template = river.parse(html)
      .replace.inner('h1', function (subtemplate) {
        return river.parse('Hello Riverbank')
      })
    h(template.render()).toArray(function (fragments) {
      var text = fragments.join('')
      expect(text).to.deep.equal(hello_riverbank)
      done()
    })
  })
  it('makes replacing multiple of content easy', function (done) {
    var template = river.parse(pet_template)
      .replace.inner('.pet-name', function () {
        return river.parse('Fluffy Puff')
      }).replace.inner('.pet-type', function () {
        return river.parse('Rabbit')
      }).replace.inner('.pet-age', function () {
        return river.parse('3')
      })
    h(template.render()).toArray(function (fragments) {
      var text = fragments.join('')
      expect(text).to.deep.equal(fluffy_puff_html)
      done()
    })
  })
  it('makes using the content of a element as a subtemplate easy', function (done) {
    var template = river.parse(html)
      .replace('h1', function (h1_template) {
        return h1_template.replace.inner('h1', function () {
          return river.parse('Hello Riverbank')
        })
      })

    h(template.render()).toArray(function (fragments) {
      var text = fragments.join('')
      expect(text).to.deep.equal(hello_riverbank)
      done()
    })
  })
  it('makes mapping over data with a template easy', function (done) {
    var template = river.parse(pet_template)
      .map(function (t, data) {
        return t.replace.inner('.pet-name', function () {
          return river.parse(data.name)
        }).replace.inner('.pet-type', function () {
          return river.parse(data.type)
        }).replace.inner('.pet-age', function () {
          return river.parse(data.age.toString())
        })
      })
    pet_stream().pipe(template)
    h(template.render()).toArray(function (fragments) {
      var text = fragments.join('')
      expect(text).to.deep.equal(fluffy_puff_html + fluffy_puff_html)
      done()
    })
  })
})

function pet_stream () {
  var stream = through.obj()
  stream.write({name: 'Fluffy Puff', type: 'Rabbit', age: 3})
  stream.end({name: 'Fluffy Puff', type: 'Rabbit', age: 3})
  return stream
}
