const booksModel = require("../model/booksModel");
const moment = require('moment')


//=========================================== 1-Create Book Api ====================================================//


const createBook = async function (req, res) {
  try { 
    const data=req.body;
    const {title,  excerpt, ISBN, category, subcategory, reviews, releasedAt}=data 
    
    data.releasedAt = new Date()
    let savedData = await booksModel.create(data)
    
    res.status(201).send({ status: true, data: savedData })
  }
  catch (err) {
    console.log(err)
    res.status(500).send({ status: false, msg: err.message })
  }
}

module.exports={createBook}