const booksModel = require("../model/booksModel");
const reviewModel = require("../model/reviewModel");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId
const { isValidBody, isValid, isValidObjectId, validISBN, releasedAtregex, validTitle } = require('../validations/bookValidations')


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
  try {
    let id = req.params.bookId
    if(!mongoose.isValidObjectId(id)){
      return res.status(400).send({status:false, message:"Use valid bookId"})
    }
    let bookDetail = await booksModel.findOne({ _id: id, isDeleted: false })
    if (!bookDetail) {
      return res.status(404).send({ status: false, message: "Book is already deleted or no any document found" })
    }

    let object = {
      _id: bookDetail._id,
      title: bookDetail.title,
      excerpt: bookDetail.excerpt,
      userId: bookDetail.userId,
      category: bookDetail.category,
      subcategory: bookDetail.subcategory,
      isDeleted: bookDetail.isDeleted,
      reviews: bookDetail.reviews,
      releasedAt: bookDetail.releasedAt,
      createdAt: bookDetail.createdAt,
      updatedAt: bookDetail.updatedAt
    }
    let review = await reviewModel.find({ bookId: id, isDeleted: false }).select({ __v: 0, isDeleted: 0, updatedAt: 0, createdAt: 0 })
    if (review) {
      object.reviews = review.length;
    }
    object.reviewsData = review
    res.send({ status: true, message: 'Books list', data: object })
  }
  catch (err) {
    res.status(500).send({ status: false, message: err.message })
  }
}





const updateBooks = async function (req, res) {
  try {
    let bookId = req.params.bookId
    
    let { title, excerpt, releasedAt, ISBN } = req.body
    if (!isValidBody(req.body)) {
      return res.status(400).send({ status: false, message: "enter data to be updated" })
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

    if (isValid(title) && validTitle(title)) {
      book.title = title
    } else return res.status(400).send({status:false, message:"enter valid title"})
    if (isValid(excerpt)) {
      book.excerpt = excerpt
    }
    if (isValid(releasedAt) && releasedAtregex(releasedAt)) {
      book.releasedAt = releasedAt
    }else return res.status(400).send({status:false, message:"enter valid date format"})

    if (isValid(ISBN) && validISBN(ISBN)) {
      book.ISBN = ISBN 
    } else return res.status(400).send({status:false, message:"enter valid ISBN"})

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