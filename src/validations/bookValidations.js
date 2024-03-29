const userModel = require("../model/userModel")
const mongoose = require("mongoose");
const booksModel = require("../model/booksModel");


const isValidBody = function (data) {
    return Object.keys(data).length > 0
}

const isValid = function (data) {
    if (typeof data === "undefined" || typeof data === "number" || data === null) return false
    if (typeof data === "string" && data.trim().length === 0) return false
    return true;
}
const isValidObjectId = function (data) {
    return mongoose.Types.ObjectId.isValid(data)
}

const releasedAtregex = function (val) {
    let regx = /^([12][0-9]{3})\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|[3][01])$/;
    return regx.test(val.trim())
}

const validTitle = function (val) {
    return /^\d*[a-zA-Z][a-zA-Z\d\s]*$/.test(val.trim())
}

const validISBN = function (val) {
    return /^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/.test(val.trim())
}

const booksValidations = async function (req, res, next) {
    try {
        let data = req.body
        if (!isValidBody(data)) {
            return res.status(400).send({ status: false, message: "Body cannot be empty" });
        }


        // Checks if title is empty or entered as a string or contains valid Title
        let title = data.title
        if (!isValid(title)) {
            return res.status(400).send({ status: false, message: "Please Enter valid Title" });
        }
        title = title.trim();
        let validTitle = /^\d*[a-zA-Z][a-zA-Z\d\s]*$/;
        if (!validTitle.test(title)) {
            return res.status(400).send({ status: false, message: "The Title may contain letters and numbers, not only numbers" });
        }
        let duplicateTitle = await booksModel.findOne({ title: title });
        if (duplicateTitle) {
            return res.status(400).send({ status: false, message: `${title} already exists` });
        }


        // Checks if excerpt is empty or entered as a string
        if (!isValid(data.excerpt)) {
            return res.status(400).send({ status: false, message: "Please Enter valid excerpt" });
        }
        data.excerpt = data.excerpt.trim();
        if (data.excerpt.length <= 10) {
            return res.status(400).send({ status: false, message: "The excerpt should contain at least 10 characters or more than 10" });
        }


        // Checks if userId is empty or contains valid userId
        let userId = req.body.userId;
        if (!isValid(userId)) {
            return res.status(400).send({ status: false, message: "Enter userId" });
        }
        if (!isValidObjectId(userId)) {
            return res.status(400).send({ status: false, message: "Please Enter userId as a valid objectId" });
        }
        if (userId != req.userId) {
            return res.status(403).send({ status: false, message: "Unauthorised access" })
        }
        // Checks whether userId is present in user collection or not
        let checkuserId = await userModel.findById(userId);
        if (!checkuserId) {
            return res.status(404).send({ status: false, message: "Entered user not found" });
        }


        // Checks if ISBN is empty or entered as a string or contains valid ISBN
        let ISBN = data.ISBN

        if (!isValid(ISBN)) {
            return res.status(400).send({ status: false, message: "Please Enter valid ISBN" });
        }

        ISBN = ISBN.trim();
        let validISBN = /^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/;
        if (!validISBN.test(ISBN)) {
            return res.status(400).send({ status: false, message: "The ISBN may contain only numbers in string and of 13 digit only" });
        }
 
        let duplicateISBN = await booksModel.findOne({ ISBN: ISBN });
        if (duplicateISBN) {
            return res.status(400).send({ status: false, message: `${ISBN} already exists` });
        }

        // Checks if category is empty or entered as a string or contains valid Category
        if (!isValid(data.category)) {
            return res.status(400).send({ status: false, message: "Please Enter valid Category" });
        }
        data.category = data.category.trim();
        let validCategory = /^\w[a-zA-Z\-]*$/;
        if (!validCategory.test(data.category)) {
            return res.status(400).send({ status: false, message: "The Category may contain only letters" });
        }


        // Checks if subCategory is empty or entered as a string or contains valid subCategory

        if (!isValid(data.subcategory)) {
            return res.status(400).send({ status: false, message: "Please Enter valid subcategory" });
        }
        if (data.subcategory) {
            if (Array.isArray(data.subcategory)) {
                req.body["subcategory"] = [...data.subcategory]
            }
            if (Object.prototype.toString.call(data.subcategory) === "[object String]") {
                let subcat = data.subcategory.split(",").map(x => x.trim())
                req.body["subcategory"] = subcat
            }
        }

        if (!isValid(data.releasedAt)) {
            return res.status(400).send({ status: false, message: "releasedAt date must be present" })
        }
        if (data.releasedAt && !releasedAtregex(data.releasedAt)) {
            return res.status(400).send({ status: false, message: "releasedAt should be in YYYY-MM-DD format" })
        }

        next();
    }
    catch (err) {
        console.log(err)
        res.status(500).send({ status: false, message: err.message })
    }
};

module.exports = { booksValidations, isValid, isValidBody, isValidObjectId, validTitle, validISBN, releasedAtregex };