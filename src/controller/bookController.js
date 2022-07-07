const booksModel = require("../model/booksModel");
const moment = require("moment");
const {isValidBody , isValid , isValidObjectId} = require('../validations/bookValidations')
//=========================================== 1-Create Book Api ====================================================//


const createBook = async function (req, res) {
  try {
    const data = req.body;
    const { title, excerpt, ISBN, category, subcategory, reviews } = data

    data.releasedAt = Date.now()
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
    if(!isValidBody(req.body)) return res.status(400).send({status: false , message: "enter data to be updated"})
    let { title, excerpt, releasedAt, ISBN } = req.body
    let bookId = req.params.bookId
    if(!isValidObjectId(bookId)) return res.status(400).send({status: false , message: "please enter valid bookid"})
    let book = await booksModel.findById(bookId)
    if (!book) return res.status(404).send({ status: false, message: "book is not present in db" })
    if (book.isDeleted) return res.status(400).send({ status: false, message: "book is already deleted" })
    let booktitle = await booksModel.findOne({ title: title })
    if (booktitle) return res.status(400).send({ status: false, message: "book title is already present" })
    let bookisbn = await booksModel.findOne({ ISBN: ISBN })
    if (bookisbn) return res.status(400).send({ status: false, message: "book isbn is already present" })

    if (isValid(title)) {
      book.title = title
    }
    if (isValid(excerpt)) {
      book.excerpt = excerpt
    }
    if (isValid(releasedAt)) {
      book.releasedAt = releasedAt
    }
    if (isValid(ISBN)) {
      book.ISBN = ISBN
    }
    book.save()
    res.status(200).send({ status: true, message: "success", data: book })
  }
  catch(err){
    res.status(500).send({status: false, message: err.message})
  }
  }
  
//====================================== 6-DeletedBooks By Path Param Id =============================================//


let deleteBooks = async function (req, res) {
  try {
    let id = req.params.bookId

    //finding id in database  
    let idvalidation = await booksModel.findById(id)

    if (idvalidation.isDeleted == true) {
      return res.status(404).send({ status: false, message: "Book already Deleted" })
    }

    if (idvalidation.isDeleted == false) {
      let validation = await booksModel.findOneAndUpdate({ _id: id }, { $set: { isDeleted: true, deletedAt: new Date() } }, { new: true })
    }
    return res.status(200).send({ status: true, message: "Successfully Deleted" })

  }
  catch (err) {
    res.status(500).send({ status: false, msg: err.message });
  }
}

module.exports = { createBook, getBooks, deleteBooks , updateBooks}
