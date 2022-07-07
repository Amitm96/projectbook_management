const userModel = require("../model/userModel")
const mongoose = require("mongoose");
const booksModel = require("../model/booksModel");


const isValidBody = function(data){
    return Object.keys(data).length > 0
}

const isValid= function(data){
    if (typeof data === "undefined" ||typeof data === "number"|| data === null) return false
    if (typeof data === "string" && data.trim().length === 0) return false
    return true;
}
const isValidObjectId = function (data) {
    return mongoose.Types.ObjectId.isValid(data)
}


const booksValidations = async function (req, res, next) {
    try {
        let data = req.body

        // Checks if title is empty or entered as a string or contains valid Title
        let title = data.title
        let duplicatetitle = await booksModel.find({ title: title });
        if (duplicatetitle.length !== 0) {
            return res.status(400).send({ status: false, msg: `${title} already exists` });
        }
        if (!title || !isValid(title)) {
            return res.status(400).send({ status: false, msg: "Please Enter valid Title" });
        }
        title = title.trim();
        let validTitle = /^\d*[a-zA-Z][a-zA-Z\d\s]*$/;
        if (!validTitle.test(title)) {
            return res.status(400).send({ status: false, msg: "The Title may contain letters and numbers, not only numbers" });
        }


        // Checks if excerpt is empty or entered as a string
        if (!data.excerpt || !isValid(data.excerpt)) {
            return res.status(400).send({ status: false, msg: "Please Enter valid excerpt" });
        }
        data.excerpt = data.excerpt.trim();
        if (data.excerpt.length <= 10) {
            return res.status(400).send({ status: false, msg: "The excerpt should contain at least 10 characters or more than 10" });
        }


        // Checks if userId is empty or contains valid userId
        let userId = req.body.userId;
        if (!userId) {
            return res.status(400).send({ status: false, msg: "Enter userId" });
        }
        if (!mongoose.isValidObjectId(userId)) {
            return res.status(400).send({ status: false, msg: "Please Enter userId as a valid objectId" });
        }
        // Checks whether userId is present in user collection or not
        let checkuserId = await userModel.findById(userId);
        if (!checkuserId) {
            return res.status(404).send({ status: false, msg: "Entered user not found" });
        }


        // Checks if ISBN is empty or entered as a string or contains valid ISBN
        let ISBN = data.ISBN

        let duplicateISBN = await booksModel.find({ ISBN: ISBN });
        if (duplicateISBN.length !== 0) {
            return res.status(400).send({ status: false, msg: `${ISBN} already exists` });
        }
        if (!ISBN || !isValid(ISBN)) {
            return res.status(400).send({ status: false, msg: "Please Enter valid ISBN" });
        }
        ISBN = ISBN.trim();
        let validISBN = /^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/;
        if (!validISBN.test(ISBN)) {
            return res.status(400).send({ status: false, msg: "The ISBN may contain only numbers in string" });
        }


        // Checks if category is empty or entered as a string or contains valid Category
        if (!data.category || !isValid(data.category)) {
            return res.status(400).send({ status: false, msg: "Please Enter valid Category" });
        }
        data.category = data.category.trim();
        let validCategory = /^\w[a-zA-Z\-]*$/;
        if (!validCategory.test(data.category)) {
            return res.status(400).send({ status: false, msg: "The Category may contain only letters" });
        }


        // Checks if subCategory is empty or entered as a string or contains valid subCategory
        console.log(data.subcategory)
        if (!data.subcategory || !isValid(data.subcategory)) {
            return res.status(400).send({ status: false, msg: "Please Enter valid subcategory" });
        }
        next();
    }
    catch (err) {
        console.log(err)
        res.status(500).send({ status: false, msg: err.message })
    }
};
module.exports = { booksValidations,isValid,isValidBody,isValidObjectId };