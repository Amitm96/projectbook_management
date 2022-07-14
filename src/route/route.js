const express = require('express');
const router = express.Router();
const { createUser, loginUser } = require('../controller/userController')
const { createBook, getBooks, getById, updateBooks, deleteBooks } = require('../controller/bookController')
const { authenticate, authorise } = require("../middleware/auth")
const { booksValidations } = require("../validations/bookValidations")
const { userValidations } = require("../validations/userValidations");
const { createReview, deleteReview, updateReview } = require('../controller/reviewController');
const { createReviewValidations } = require('../validations/reviewValidation');



router.post('/register', userValidations, createUser)
router.post('/login', loginUser) 

router.post('/books',authenticate,booksValidations, createBook)
router.get('/books', authenticate, getBooks)
router.get('/books/:bookId', authenticate, getById)
router.put('/books/:bookId', authenticate, authorise, updateBooks)
router.delete('/books/:bookId', authenticate, authorise, deleteBooks)

router.post('/books/:bookId/review', createReviewValidations, createReview)
router.delete('/books/:bookId/review/:reviewId', deleteReview)
router.put('/books/:bookId/review/:reviewId', updateReview)

router.all('/**', function(req, res){
    res.status(400).send({status: false, messsage:"invalid http request"})
})

module.exports = router;