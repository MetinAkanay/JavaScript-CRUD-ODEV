const express = require("express")
const mongoose = require("mongoose")
const dotenv = require("dotenv").config()
const employee = require("../models/EmployeeModel")
const jwt = require("jsonwebtoken")
const TokenControl = require("../middleware/auth")
const EmployeeRouter = express.Router()

EmployeeRouter.post("/register", async (req, res) => {
    try {
        let Newemployee = await employee.create(req.body)
        res.status(200).send({ status: true, message: `${Newemployee.UserName} Created ` })
    } catch (error) {
        let errorMessage = "An error occurred"

        if (error.name === 'ValidationError') {
            for (let field in error.errors) {
                switch (error.errors[field].path) {
                    case 'UserName':
                    case 'Name':
                    case 'Surname':
                    case 'Password':
                    case 'Email':
                    case 'Phonenumber':
                        errorMessage = error.errors[field].message
                        break
                    default:
                        errorMessage = "Validation error"
                }
                break
            }
        } else if (error.code === 11000) {
            if (error.keyValue.UserName) {
                errorMessage = "This username is already in use"
            } else if (error.keyValue.Email) {
                errorMessage = "This email is already in use"
            } else if (error.keyValue.Phonenumber) {
                errorMessage = "This phone number is already in use"
            }
        }

        res.status(400).send({ status: false, message: errorMessage })
    }
})

EmployeeRouter.post("/login", async (req, res) => {
    try {
        const { UserName, Password } = req.body;
        if (!UserName || !Password || UserName === "" || Password === "") {
            return res.status(400).send({ status: false, message: "UserName and Password must be provided" })
        }

        const enteredEmployee = await employee.findOne({ UserName })
        if (!enteredEmployee) {
            return res.status(404).send({ status: false, message: "UserName not found" })
        }

        if (Password === enteredEmployee.Password) {
            let access_token = jwt.sign({ id: enteredEmployee._id, UserName: enteredEmployee.UserName }, process.env.KEYFORJWT, { expiresIn: "30m" })
            console.log(access_token)
            res.status(200).send({ status: true, message: `Welcome ${enteredEmployee.UserName}`, employee: enteredEmployee })
        } else {
            return res.status(404).send({ status: false, message: "Incorrect Password" })
        }

    } catch (error) {
        res.status(404).send({ status: false, message: error.message })
    }
});

EmployeeRouter.put("/update", async (req, res) => {
    const updateData = {};
    try {
        const { UserName, Password } = req.body
        const enteredEmployee = await employee.findOne({ UserName })

        if (!UserName || !Password || UserName === "" || Password === "") {
            return res.status(400).send({ status: false, message: "UserName and Password must be provided" })
        }
        if (!enteredEmployee) {
            return res.status(404).send({ status: false, message: "User not found" })
        }
        if (Password !== enteredEmployee.Password) {
            return res.status(401).send({ status: false, message: "Incorrect password" })
        }

        for (const key in req.body) {
            if (key.startsWith("New")) {
                const newField = key.substring(3)
                if (newField && enteredEmployee[newField] !== undefined) { 
                    updateData[newField] = req.body[key]
                }
            }
        }

        if (Object.keys(updateData).length === 0) {
            return res.status(400).send({ status: false, message: "You must provide a value to update" });
        }

        Object.assign(enteredEmployee, updateData)
        await enteredEmployee.save()

        res.status(200).send({ status: true, message: "Employee information updated successfully.", data: enteredEmployee })


    } catch (error) {
        let errorMessage = "An error occurred"
        if (error.name === 'ValidationError') {
            errorMessage = Object.values(error.errors).map(err => err.message)
        } else if (error.code === 11000) {
            const fieldName = Object.keys(error.keyValue)[0]
            errorMessage = `Duplicate value error: ${error.keyValue[fieldName]} is already in use for ${fieldName}.`
        } else {
            errorMessage = error.message
        }
        res.status(500).send({ status: false, message: errorMessage })
    }
})

EmployeeRouter.get("/getAll", TokenControl,async(req,res)=>{
    try {
        let employees = await employee.find({})
        return res.status(200).send({status: true, message: "Employees", employees:employees})

    } catch (error) {
        res.status(404).send({status: false, message: error.message})
    }
})

EmployeeRouter.delete("/delete/:id", async (req, res) => {
    try {
        const { id } = req.params
        const deletedEmployee = await employee.findByIdAndDelete(id)
        if (!deletedEmployee) {
            return res.status(404).send({ status: false, message: "Employee not found" })
        }
        res.status(200).send({ status: true, message: "Employee deleted successfully" })
    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
})




module.exports = EmployeeRouter