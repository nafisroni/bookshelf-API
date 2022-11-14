const { nanoid } = require('nanoid');
const books = require('./books');

// buat addHandler
    const addBookHandler = (request, h) => {
        const {
            name,
            year,
            author,
            summary,
            publisher,
            pageCount,
            readPage,
            reading,
        } = request.payload;

        if (!name) {
            const response = h.response({
                    status: 'fail',
                    message: 'Gagal menambahkan buku. Mohon isi nama buku',
                })
                .code(400);
                return response;
        }
        if (readPage > pageCount) {
            const response = h.response({
                status: 'fail',
                message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
            })
            .code(400);
            return response;
        }

        const id = nanoid(16);
        const finished = pageCount === readPage;
        const createdAt = new Date().toISOString();
        const updatedAt = createdAt;

        const newBook = {
            id,
            name,
            year,
            author,
            summary,
            publisher,
            pageCount,
            readPage,
            reading,
            finished,
            updatedAt,
        };
        books.push(newBook);

        const isSuccess = books.filter((book) => book.id === id).length > 0;
        if (isSuccess) {
            const response = h.response({
            status: 'success',
            message: 'Buku berhasil ditambahkan',
            data: {
                bookId: id,
            },
            });
            response.code(201);
            return response;
        }
        const response = h.response({
            status: 'error',
            message: 'Buku gagal ditambahkan',
        });
        response.code(500);
        return response;
    };

const getAllBooksHandler = (request, h) => {
    const { name, reading, finished } = request.query;
    let filterBooks = books;

    if (name !== undefined) {
        filterBooks = filterBooks.filter(
            (book) => book.name.toLowerCase().includes(name.toLowerCase()),
            );
    }
    if (reading !== undefined) {
        filterBooks = filterBooks.filter(
            (book) => book.reading === Number(reading),
            );
    }
    if (finished !== undefined) {
        filterBooks = filterBooks.filter(
            (book) => book.finished === Number(finished),
        );
    }
    const response = h.response({
        status: 'success',
        data: {
            books: books.map((book) => ({
                id: book.id,
                name: book.name,
                publisher: book.publisher,
            })),
        },
    })
    .code(200);
    return response;
};

const getBookByIdHandler = (request, h) => {
    const { bookId } = request.params;
    const thisBook = books.filter((b) => b.id === bookId)[0];

    if (thisBook !== undefined) {
        const response = h.response({
        status: 'success',
        data: {
            book: thisBook,
        },
        });
        response.code(200);
        return response;
    }
    const response = h.response({
        status: 'fail',
        message: 'Buku tidak ditemukan',
      });
      response.code(404);
      return response;
};
const editBookByIdHandler = (request, h) => {
    const { bookId } = request.params;
    const {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
    } = request.payload;
    const index = books.findIndex((book) => book.id === bookId);
    if (!name) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku',
        })
        .code(400);
        return response;
    }
    if (readPage > pageCount) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. readPage tidak boleh lebih dari pageCount',
        });
        response.code(400);
        return response;
    }

    const finished = pageCount === readPage;
    const updatedAt = new Date().toISOString();

    if (index !== -1) {
        books[index] = {
        ...books[index],
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
        finished,
        updatedAt,
        };

        const response = h.response({
          status: 'success',
          message: 'Buku berhasil diperbarui',
        });
        response.code(200);
        return response;
      }
      const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan',
      });
      response.code(400);
      return response;
    };

const deleteBookByIdHandler = (request, h) => {
    const { bookId } = request.params;
    const index = books.findIndex((book) => book.id === bookId);
    if (index !== -1) {
        books.splice(index, 1);
        const response = h.response({
          status: 'success',
          message: 'Buku berhasil dihapus',
        });
        response.code(200);
        return response;
      }

      const response = h.response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan',
      });
      response.code(404);
      return response;
};

module.exports = {
    addBookHandler,
    getAllBooksHandler,
    getBookByIdHandler,
    editBookByIdHandler,
    deleteBookByIdHandler,
};

// {
//     id: string,
//     title: string,
//     createdAt: string,
//     updatedAt: string,
//     tags: array of string,
//     body: string,
//    },