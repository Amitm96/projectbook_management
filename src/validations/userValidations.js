const userModel = require('../model/userModel')

const isValid = function (value) {
    if (typeof value === "undefined" || value === null || typeof value === "number") return false;
    if (typeof value === "string" && value.trim().length === 0) return false;
    return true
}

const userValidations = async function (req, res, next) {
    try {
        let data = req.body;

        // Checks whether body is empty or not
        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, message: "Body cannot be empty" });
        }


        // Checks whether title is empty or is enter as a string or contains the enumerator values or not.
        let titles = ["Mr", "Mrs", "Miss"];
        if (!isValid(data.title)) {
            return res.status(400).send({ status: false, message: " Please enter valid Title" });
        }
        data.title = data.title.trim();
        if (!titles.includes(data.title)) {
            return res.status(400).send({ status: false, message: "Please enter title as Mr, Mrs or Miss only", });
        }


        // Checks whether data name is empty or is enter as a string or contains only letters
        if (!isValid(data.name)) {
            return res.status(400).send({ status: false, message: "Please enter valid user name" });
        }
        let validname = /^\w[a-zA-Z.,\s]*$/;
        data.name = data.name.trim();
        if (!validname.test(data.name)) {
            return res.status(400).send({ status: false, message: "The user name may contain only letters" });
        }


        //    phone validations
        if (!isValid(data.phone)) {
            return res.status(400).send({ status: false, message: "Please Enter valid Phone Number" });
        }
        let validPhone = /^(\+?\d{1,4}[\s-])?(?!0+\s+,?$)\d{10}\s*,?$/
        if (!validPhone.test(data.phone)) {
            return res.status(400).send({ status: false, message: "The user phone number should be indian may contain only 10 number" });
        }
        let phone = data.phone.trim();
        let duplicatePhone = await userModel.find({ phone: phone });
        if (duplicatePhone.length !== 0) {
            return res.status(400).send({ status: false, message: `${phone} already exists` });
        }


        // email validations
        if (!isValid(data.email)) {
            return res.status(400).send({ status: false, message: "Please enter valid E-mail" });
        }
        let email = data.email.trim();
        if (!/^([0-9a-z]([-_\\.]*[0-9a-z]+)*)@([a-z]([-_\\.]*[a-z]+)*)[\\.]([a-z]{2,9})+$/.test(email)) {
            return res.status(400).send({ status: false, message: "Entered email is invalid" });
        }
        let duplicateEmail = await userModel.find({ email: email });
        if (duplicateEmail.length !== 0) {
            return res.status(400).send({ status: false, message: `${email} already exists` });
        }


        // Checks whether password is empty or is enter as a string or a valid pasword.
        if (!isValid(data.password)) {
            return res.status(400).send({ status: false, message: "Please enter valid Password" });
        }
        let validPassword = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,20}$/;
        if (!validPassword.test(data.password)) {
            return res.status(400).send({ status: false, message: "Please enter min 8 letter password, with at least a symbol, upper and lower case letters and a number" });
        }


        // check address validations
        if (!isValid(data.address.street)) {
            return res.status(400).send({ status: false, message: "Please enter valid street" });
        }
        if (!/^\d*[a-zA-Z\d\s,.]*$/.test(data.address.street)) {
            return res.status(400).send({ status: false, message: "The street name may contain only letters" });
        }
        if (!isValid(data.address.city)) {
            return res.status(400).send({ status: false, message: "Please enter valid city" });
        }
        if (!/^\w[a-zA-Z.,\s]*$/.test(data.address.city)) {
            return res.status(400).send({ status: false, message: "The user name may contain only letters" });
        }
        if (!isValid(data.address.pincode)) {
            return res.status(400).send({ status: false, message: "Please enter valid pincode" });
        }
        let pincode = data.address.pincode.trim();
        if (!/^[1-9][0-9]{5}$/.test(pincode)) {
            return res.status(400).send({ status: false, message: " Please Enter Valid Pincode Of 6 Digits" });
        }
        next();
    } 
    catch (error) {
        console.log(error);
        res.status(500).send({ status: false, message: error.message });
    }
};

module.exports = { userValidations }