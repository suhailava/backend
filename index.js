//PS_PL_7
//PS_DL_6
//PS_FPL_6
//PS_FPL_18
//PS_FPL_30
//PS_FPL_44
//PS_OC_9
//PS_OC_19
const express=require('express');

const App =express();

const { Router } = require("./src/candidateInfo/Router")

App.use(express.json());
App.use(function (request, response, next) {

    response.setHeader("Access-Control-Allow-Origin", "*")

    response.setHeader("Access-Control-Allow-Credentials", "true");

    response.setHeader("Access-Control-Allow-Headers", "content-type");

    response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");

    next();

})

App.use('/candidates', Router)

//to check the server is running on the port
// App.get('/',(req,res)=>{
//     res.send('<p>asdfg</p>')
// })


App.listen(4000, () => {
    console.log("Success")
})

