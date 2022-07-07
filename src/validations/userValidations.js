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
            return res.status(400).send({ status: false, msg: "Body cannot be empty" });
        }


        // Checks whether title is empty or is enter as a string or contains the enumerator values or not.
        if (!data.title || isValid(data.title)) {
            return res.status(400).send({ status: false, msg: " Please enter valid Title" });
        }
        let titles = ["Mr", "Mrs", "Miss"];
        data.title = data.title.trim();
        if (!titles.includes(data.title)) {
            return res.status(400).send({ status: false, msg: "Please enter title as Mr, Mrs or Miss only", });
        }


        // Checks whether data name is empty or is enter as a string or contains only letters
        if (!data.name || !isValid(data.name)) {
            return res.status(400).send({ status: false, msg: "Please enter valid user name" });
        }
       let validname = /^\w[a-zA-Z.,\s]*$/;
        data.name = data.name.trim();
       if (!validname.test(data.name)) {
        return res.status(400).send({ status: false, msg: "The user name may contain only letters" });
       }


        // email validations
       if (!data.email || !isValid(data.email)) {
        return res.status(400).send({ status: false, msg: "Please enter E-mail" });
       }
       let email = data.email;
        if (!/^([0-9a-z]([-_\\.]*[0-9a-z]+)*)@([a-z]([-_\\.]*[a-z]+)*)[\\.]([a-z]{2,9})+$/.test(email)) {
            return res.status(400).send({ status: false, msg: "Entered email is invalid" });
        }
        let duplicateEmail = await userModel.find({ email: email });
        if (duplicateEmail.length !== 0) {
            return res.status(400).send({ status: false, msg: `${email} already exists` });
        }


        //    phone validations
        if (!data.phone ||!isValid(data.phone)) {
            return res.status(400).send({ status: false, msg: "Please Enter valid Phone Number" });
        }
        let validPhone = /^(\+?\d{1,4}[\s-])?(?!0+\s+,?$)\d{10}\s*,?$/
        if (!validPhone.test(data.phone)) {
            return res.status(400).send({ status: false, msg: "The user phone number should be indian may contain only 10 number" });
        }
        let phone = data.phone;
        let duplicatePhone = await userModel.find({ phone: phone });
        if (duplicatePhone.length !== 0) {
            return res.status(400).send({ status: false, msg: `${phone} already exists` });
        }


        // Checks whether password is empty or is enter as a string or a valid pasword.
        if (!data.password || !isValid(data.password)) {
            return res.status(400).send({ status: false, msg: "Please enter valid Password" });
        }
       let validPassword = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,20}$/;
       if (!validPassword.test(data.password)) {
        return res.status(400).send({ status: false, msg: "Please enter min 8 letter password, with at least a symbol, upper and lower case letters and a number" });
       }


        // check address validations
       if(!isValid(data.address.street) )
        if (typeof data.address.street!== "string") return res.status(400).send({ status: false, msg: " Please enter street as a String" });
        if(data.address.city)
        if (typeof data.address.city!== "string") return res.status(400).send({ status: false, msg: " Please enter city as a String" });
        if(data.address.pincode)
        if (typeof data.address.pincode!== "string") return res.status(400).send({ status: false, msg: " Please enter pincode as a String" });
        let pincode = data.pincode;
        if (/^([^0][0-9]){6}$/.test(pincode)) return res.status(400).send({ status: false, msg: " Please Enter Valid Pincode Of 6 Digits" });

        next();
    } catch (error) {
        console.log(error);
        res.status(500).send({ status: false, msg: error.message });
    }
};
module.exports = { userValidations }
