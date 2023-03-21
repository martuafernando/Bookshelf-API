const books = require('./endpoint/books')

const routes = [
  {
    method: 'POST', path: '/books', handler: books
  }
]

module.exports = routes
