const booksModel = require("../model/booksModel");



//=========================================== 1-Create Book Api ====================================================//


const createBook = async function (req, res) {
  try { 
    const data=req.body;
    const {title,  excerpt, ISBN, category, subcategory, reviews, releasedAt}=data 
    
    let savedData = await booksModel.create(data)
    if(savedData){
        savedData.releasedAt=new Date()
    }
    res.status(201).send({ status: true, data: savedData })
  }
  catch (err) {
    console.log(err)
    res.status(500).send({ status: false, msg: err.message })
  }
}

module.exports={createBook}