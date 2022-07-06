const express=require('express');
const router=express.Router();
const {createUser, loginUser}=require('../controller/userController')
const {createBook}=require('../controller/bookController')

router.post('/register', createUser)
router.post('/login', loginUser)

router.post('/books', createBook)

module.exports=router;