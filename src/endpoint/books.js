const { nanoid } = require('nanoid')
const storedBooks = require('../storage/storedBooks')

module.exports = function storeBooks (request, h) {
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload

  if (!name) {
    return h
      .response({ status: 'fail', message: 'Gagal menambahkan buku. Mohon isi nama buku' })
      .code(400)
  }

  if (readPage > pageCount) {
    return h
      .response({ status: 'fail', message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount' })
      .code(400)
  }

  const now = new Date().toISOString()
  const book = {
    id: nanoid(16),
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished: pageCount === readPage,
    reading,
    insertedAt: now,
    updatedAt: now
  }

  storedBooks.push(book)

  const isSuccess = storedBooks.filter((book) => book.id === storedBooks.id)

  if (isSuccess) {
    return h
      .response({
        status: 'success',
        message: 'Buku berhasil ditambahkan',
        data: {
          bookId: book.id
        }
      })
      .code(201)
  }

  return h
    .response({ status: 'fail', message: 'Gagal menambahkan buku' })
    .code(500)
}
