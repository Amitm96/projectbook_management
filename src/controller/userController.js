const userModel = require("../model/userModel")
const jwt = require("jsonwebtoken");



//=========================================== 1-Create User Api ====================================================//


const createUser = async function (req, res) {
  try {
    const data = req.body;
    let savedData = await userModel.create(data)
    res.status(201).send({ status: true, data: savedData })
  }
  catch (err) {
    console.log(err)
   return res.status(500).send({ status: false, msg: err.message })
  }
}




//============================================ 2-Login and Token Generation Api =====================================//


const loginUser = async function (req, res) {
  try {
    let data = req.body
    let email = req.body.email
    let password = req.body.password

    if (Object.keys(data).length == 0) {
      return res.status(400).send({ status: false, message: "Body cannot be empty" });
    }

    // Checks whether email is entered or not
    if (!email) return res.status(400).send({ status: false, msg: "Please enter E-mail" });

    // Checks whether password is entered or not
    if (!password) return res.status(400).send({ status: false, msg: "Please enter Password" });


    //Finding credentials 
    let user = await userModel.findOne({ email: email, password: password })
    if (!user) {
      return res.status(401).send({ status: false, msg: "Invalid email or password" })
    }

    //Token generation
    let token = jwt.sign({
      userId: user._id.toString(),
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 7600
    },
      "4A group"
    );
    // res.setHeader("x-api-key", token);

    res.status(200).send({ status: true, data: { token } });
  }
  catch (err) {
    return res.status(500).send({ status: false, msg: err.message })
  }
};


module.exports = { createUser, loginUser }