const moment = require("moment")

//const moment = require(moment)
console.log(Date.now())

console.log(Math.floor(new Date().getTime()/1000))
console.log(Math.random().toString().substring(2,10))
let date = new Date('2018/06/01')
let time = moment(Date.now()).format('YYYY-M-d')
console.log(time)