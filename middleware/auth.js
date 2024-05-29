const jwt = require("jsonwebtoken")
require('dotenv').config();

const TokenControl = (req,res,next)=>{
    let token = req.headers.authorization
    if(!token) return res.status(401).json({status: false, message: "Unauthorized"})

        jwt.verify(token, process.env.KEYFORJWT, (error, data) => {
            if (error) return res.status(403).json({ status: false, message: "Token is invalid" })
            req.data = data
            next()
        })
}

module.exports = TokenControl