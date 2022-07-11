const reviewModel = require("../model/reviewModel")
const booksModel = require('../model/booksModel')
const mongoose = require("mongoose");

const createReview = async function (req, res) {
    try {

        let data = req.body;

        data.reviewedAt = Date.now()
        data.reviewedBy = data.reviewedBy;
        data.bookId = req.params.bookId;

        let save = await reviewModel.create(data);
        let find = {
            _id: save._id,
            bookId: save.bookId,
            reviewedBy: save.reviewedBy,
            reviewedAt: save.reviewedAt,
            rating: save.rating,
            review: save.review
        }
        res.status(201).send({ status: true, data: find })

    } catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }
}


const updateReview = async function(req,res){
    let bookId = req.params.bookId;
    let reviewId = req.params.reviewId
      body =req.body;
      const {review,reviewedBy,rating}=body
    let find= await booksModel.findOne({isDeleted:false,_id:bookId})
    if(!find){
        res.status(404).send({status:false,msg:"book id not exist"})
    }
    
   let update = await reviewModel.findOneAndUpdate({_id:reviewId,bookId:bookId,isDeleted:false},{$set:{reviewedBy,rating,review}},{new:true}).
   select({_id:1,bookId:1,review:1,reviewedBy:1,reviewedAt:1,rating:1})
   if(!update){
    return res.status(404).send({status:false,msg:"reviewId not found"})
   }
   console.log(update)
   let object={
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
   object.reviewsData = update

    return res.status(200).send({status:true,message:'Books list', data:object})
   
}

let deleteReview = async function (req, res) {
    try {
        let bId = req.params.bookId
        let rId = req.params.reviewId

        if (!mongoose.isValidObjectId(bId)) {
            return res.status(400).send({ status: false, message: "write valid book id" });
        }
        if (!mongoose.isValidObjectId(rId)) {
            return res.status(400).send({ status: false, message: "write valid review Id" });
        }


        let book = await booksModel.findOne({ _id: bId, isDeleted: false })
        if (!book) {
            return res.status(404).send({ status: false, message: "book is not present or deleted" })
        }

        let review = await reviewModel.findOne({ _id: rId, isDeleted: false })
        if (!review) {
            return res.status(404).send({ status: false, message: "review is not present or deleted" })
        }

        if (review.bookId != bId) {
            return res.status(400).send({ status: false, message: "enter correct reviewid for the book" })
        }

        review.isDeleted = true
        review.save()
        res.status(200).send({ status: true, message: "review deleted successfully" })
    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }

}


module.exports = { createReview,updateReview, deleteReview }