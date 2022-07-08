const express=require('express');
const router=express.Router();
const {createUser, loginUser}=require('../controller/userController')
const {createBook ,getBooks,getById, updateBooks, deleteBooks}=require('../controller/bookController')
const {authenticate, authorise}=require("../middleware/auth")
const  { booksValidations }=require("../validations/bookValidations")
const  { userValidations }=require("../validations/userValidations")



router.post('/register',userValidations, createUser)
router.post('/login', loginUser) 

router.post('/books',booksValidations, createBook) 
router.get('/books', getBooks)
router.get('/books/:bookId', getById)
router.put('/books/:bookId', updateBooks)
router.delete('/books/:bookId', deleteBooks) 

module.exports=router;