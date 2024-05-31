const express = require("express")
const mongoose = require("mongoose")
const dotenv = require("dotenv").config()
const EmployeeRouter = require("./router/EmployeeRouter")
const authMiddleware = require("./middleware/auth")

mongoose.connect("mongodb+srv://metinakanay:kuEK3I9hQZ1Ata3J@cluster0.fagfvdk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
.then(()=>console.log("MongoDB connected"))
.catch((err)=>console.log(err))

const app = express()

app.use(express.json())

app.use("/employee", EmployeeRouter)

app.use(authMiddleware)


app.listen(8888,()=>{
    console.log("8888 Portu Çalışmaya Başladı")
})