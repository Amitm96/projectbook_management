const booksModel = require("../model/booksModel");
const reviewModel = require("../model/reviewModel");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId
const { isValidBody, isValid, isValidObjectId } = require('../validations/bookValidations')


//=========================================== 1-Create Book Api ====================================================//


const createBook = async function (req, res) {
  try {
    const data = req.body;
    let savedData = await booksModel.create(data)
    res.status(201).send({ status: true, data: savedData })
  }
  catch (err) {
    console.log(err)
    res.status(500).send({ status: false, msg: err.message })
  }
}


const getBooks = async function (req, res) {
  try {
    let query = req.query;
    const { userId, category, subcategory } = query;

    let filter = { isDeleted: false }

    if (userId) {
      filter.userId = query.userId
      if (!ObjectId.isValid(userId)) {
        return res.status(400).send({ status: false, message: "not a valid userId" })
      }
    }

    if (category) {
      filter.category = query.category
    }

    if (subcategory) {
      filter.subcategory = query.subcategory
    }

    let getData = await booksModel.find(filter).select({ userId: 1, title: 1, excerpt: 1, category: 1, reviews: 1, releasedAt: 1 }).sort({ title: 1 })

    if (getData.length == 0) {
      return res.status(404).send({ status: false, msg: "No such document exist with the given attributes." });
    }
    res.status(200).send({ status: true, message: 'Books list', data: getData })
  }
  catch (err) {
    console.log(err)
    res.status(500).send({ status: false, msg: err.message })
  }
}




const getById = async function (req, res) {
  let id = req.params.bookId

  let find = await booksModel.findOne({ _id: id, isDeleted: false })
  if (!find) {
    return res.status(404).send({ status: false, message: "Book is already deleted or not present" })
  }

  let object = {
    _id: find._id,
    title: find.title,
    excerpt: find.excerpt,
    userId: find.userId,
    category: find.category,
    isDeleted: find.isDeleted,
    reviews: find.reviews,
    releasedAt: find.releasedAt,
    createdAt: find.createdAt,
    updatedAt: find.updatedAt
  }
  let review = await reviewModel.find({ bookId: id })

  object.reviewsData = review
  res.send({ status: true, message: 'Books list', data: object })
}




const updateBooks = async function (req, res) {
  try {
    if (!isValidBody(req.body)) {
      return res.status(400).send({ status: false, message: "enter data to be updated" })
    }

    let { title, excerpt, releasedAt, ISBN } = req.body
    let bookId = req.params.bookId

    if (!isValidObjectId(bookId)) {
      return res.status(400).send({ status: false, message: "please enter valid bookid" })
    }

    let book = await booksModel.findById(bookId)
    if (!book) {
      return res.status(404).send({ status: false, message: "Book is not present in db" })
    }
    if (book.isDeleted) {
      return res.status(400).send({ status: false, message: "Book is already deleted" })
    }

    let booktitle = await booksModel.findOne({ title: title })
    if (booktitle) {
      return res.status(400).send({ status: false, message: "Given Book title is already present, Please use Another one" })
    }

    let bookisbn = await booksModel.findOne({ ISBN: ISBN })
    if (bookisbn) {
      return res.status(400).send({ status: false, message: "Given isbn is already present, Please use Another one" })
    }

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
  catch (err) {
    res.status(500).send({ status: false, message: err.message })
  }
}



//====================================== 6-DeletedBooks By Path Param Id =============================================//


let deleteBooks = async function (req, res) {
  try {
    let id = req.params.bookId

    if (!ObjectId.isValid(id)) {
      return res.status(400).send({ status: false, message: "not a valid bookId" })
    }

    let validation = await booksModel.findOneAndUpdate({ _id: id, isDeleted: false }, { $set: { isDeleted: true, deletedAt: new Date() } }, { new: true })
    if (!validation) {
      return res.status(404).send({ status: false, message: "Book is already deleted or does not exist" })
    }
    return res.status(200).send({ status: true, message: "Successfully Deleted" })

  }
  catch (err) {
    res.status(500).send({ status: false, msg: err.message });
  }
}


module.exports = { createBook, getBooks, deleteBooks, updateBooks, getById }
