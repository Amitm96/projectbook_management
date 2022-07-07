const booksModel = require("../model/booksModel");
const moment = require('moment')


//=========================================== 1-Create Book Api ====================================================//


const createBook = async function (req, res) {
  try {
    const data = req.body;
    const { title, excerpt, ISBN, category, subcategory, reviews } = data

    data.releasedAt = moment(Date.now()).format('YYYY-M-d')
    console.log(data.releasedAt)
    let savedData = await booksModel.create(data)

    res.status(201).send({ status: true, data: savedData })
  }
  catch (err) {
    console.log(err)
    res.status(500).send({ status: false, msg: err.message })
  }
}


const getBooks = async function (req, res) {
  let query = req.query;
  const { userId, category, subcategory } = query;

  let filter = { isDeleted: false }




  if (userId) {
    filter.userId = query.userId
  }

  if (category) {
    filter.category = query.category
  }

  if (subcategory) {
    filter.subcategory = query.subcategory
  }


  let getData = await booksModel.find(filter).select({ userId: 1, title: 1, excerpt: 1, category: 1, reviews: 1, releasedAt: 1 }).sort({ title: 1 })
  res.status(200).send({ status: true, message: 'Books list', data: getData })

}

const updateBooks = async function (req, res) {
  try {
    let { title, excerpt, releasedAt, ISBN } = req.body
    let bookId = req.params.bookId
    let book = await booksModel.findById(bookId)
    if (!book) return res.status(404).send({ status: false, message: "book is not present in db" })
    if (book.isDeleted) return res.status(400).send({ status: false, message: "book is already deleted" })
    let booktitle = await booksModel.findOne({ title: title })
    if (booktitle) return res.status(400).send({ status: false, message: "book title is already present" })
    let bookisbn = await booksModel.findOne({ ISBN: ISBN })
    if (bookisbn) return res.status(400).send({ status: false, message: "book isbn is already present" })

    if (title) {
      book.title = title
    }
    if (excerpt) {
      book.excerpt = excerpt
    }
    if (releasedAt) {
      book.releasedAt = releasedAt
    }
    if (ISBN) {
      book.ISBN = ISBN
    }
    book.save()
    res.status(200).send({ status: true, message: "success", data: book })
  }
  catch(err){
    res.status(500).send({status: false, message: err.message})
  }
  }
  

module.exports = { createBook, getBooks, updateBooks }
