const { nanoid } = require('nanoid')
const storedBooks = require('../storage/storedBooks')

function storeBooks (request, h) {
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

function getAllBooks (request, h) {
  const books = []
  const { reading, finished, name } = request.query
  let allBooks = storedBooks

  if (reading === '1') allBooks = storedBooks.filter((it) => it.reading === true)
  if (reading === '0') allBooks = storedBooks.filter((it) => it.reading === false)

  if (finished === '1') allBooks = storedBooks.filter((it) => it.finished === true)
  if (finished === '0') allBooks = storedBooks.filter((it) => it.finished === false)

  if (name) allBooks = storedBooks.filter((it) => it.name.toLowerCase().includes(name.toLowerCase()))

  allBooks.forEach((book) => {
    books.push({
      id: book.id,
      name: book.name,
      publisher: book.publisher
    })
  })

  return h
    .response({
      status: 'success',
      data: {
        books
      }
    })
    .code(200)
}

function getDetailBook (request, h) {
  const { bookId } = request.params
  const book = storedBooks.filter((it) => it.id === bookId)[0]

  if (!book) {
    return h
      .response({ status: 'fail', message: 'Buku tidak ditemukan' })
      .code(404)
  }

  return h
    .response({
      status: 'success',
      data: {
        book
      }
    })
    .code(200)
}

function updateBook (request, h) {
  const { bookId } = request.params
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload
  const indexBook = storedBooks.findIndex((it) => it.id === bookId)

  if (indexBook === -1) {
    return h
      .response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan'
      })
      .code(404)
  }

  if (!name) {
    return h
      .response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Mohon isi nama buku'
      })
      .code(400)
  }

  if (readPage > pageCount) {
    return h
      .response({
        status: 'fail',
        message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
      })
      .code(400)
  }

  const now = new Date().toISOString()
  storedBooks[indexBook] = {
    ...storedBooks[indexBook],
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished: pageCount === readPage,
    reading,
    updatedAt: now
  }

  return h
    .response({
      status: 'success',
      message: 'Buku berhasil diperbarui'
    })
    .code(200)
}

function deleteBook (request, h) {
  const { bookId } = request.params
  const indexBook = storedBooks.findIndex((book) => book.id === bookId)

  if (indexBook === -1) {
    return h
      .response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan'
      })
      .code(404)
  }

  storedBooks.splice(indexBook, 1)
  return h
    .response({
      status: 'success',
      message: 'Buku berhasil dihapus'
    })
    .code(200)
}

module.exports = { storeBooks, getAllBooks, getDetailBook, updateBook, deleteBook }
