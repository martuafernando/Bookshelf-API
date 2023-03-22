const { storeBooks, getAllBooks, getDetailBook, updateBook, deleteBook } = require('./endpoint/books')

const routes = [
  { method: 'GET', path: '/books', handler: getAllBooks },
  { method: 'GET', path: '/books/{bookId}', handler: getDetailBook },

  { method: 'POST', path: '/books', handler: storeBooks },

  { method: 'PUT', path: '/books/{bookId}', handler: updateBook },

  { method: 'DELETE', path: '/books/{bookId}', handler: deleteBook }
]

module.exports = routes
