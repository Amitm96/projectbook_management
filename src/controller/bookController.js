const booksModel = require("../model/booksModel");

const moment = require("moment");
const { query } = require("express");

//=========================================== 1-Create Book Api ====================================================//


const createBook = async function (req, res) {
  try { 
    const data=req.body;
    const {title,  excerpt, ISBN, category, subcategory, reviews}=data 
    
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


const getBooks= async function(req,res){
  let query =req.query;
  const {userId,category,subcategory}=query;

  let filter ={isDeleted:false}
   
  


  if(userId){
     filter.userId =query.userId}

  if(category){
  filter.category=query.category}

  if(subcategory){
  filter.subcategory= query.subcategory}
  

  let getData = await booksModel.find(filter).select({userId:1,title:1,excerpt:1,category:1,reviews:1,releasedAt:1}).sort({title:1})
  res.status(200).send({status:true,message: 'Books list',data:getData})

}


module.exports={createBook,getBooks}
