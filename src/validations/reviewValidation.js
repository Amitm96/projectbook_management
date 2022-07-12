const mongoose = require("mongoose");
const booksModel = require("../model/booksModel")

const isValid = function (value) {
    if (typeof value === "undefined" || value === null || typeof value === "number") return false;
    if (typeof value === "string" && value.trim().length === 0) return false;
    return true
}


const createReviewValidations = async function (req, res, next) {
    try {
        let bookId = req.params.bookId;
        if (!mongoose.isValidObjectId(bookId)) {
            return res.status(400).send({ status: false, message: "write valid objectId" });
        }
        let checkBookId = await booksModel.findOne({ _id: bookId, isDeleted: false })
        if (!checkBookId) {
            return res.status(400).send({ status: false, message: "write valid bookId that are present in your collections or not deleted" });
        }
        let data = req.body;
        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, message: "body can not be empty" });
        }



        // let validname = /^\w[a-zA-Z.,\s]*$/;
        // data.reviewedBy = data.reviewedBy.trim();
        // if (!validname.test(data.reviewedBy)) {
        //     return res.status(400).send({ status: false, message: "The reviewer name may contain only letters" });
        // }


        if (!data.rating) {
            return res.status(400).send({ status: false, message: "Write rating" });
        }
        if (typeof data.rating != "number") {
            return res.status(400).send({ status: false, message: "Write rating in a number" });
        }
        if ((data.rating < 1) || (data.rating > 5)) {
            return res.status(400).send({ status: false, message: "You can give rating more than 0  or less than 5 in number only" });
        }

        next();

    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
};


module.exports = { createReviewValidations }