const {Schema, model} = require("mongoose")
const validator = require("validator")

const EmployeeSchema = new Schema({
    UserName : {
        type: String,
        required: [true, "UserName field is required"],
        minlength: [3, "UserName must be at least 3 characters"], 
        unique: true
    },
    Name: {
        type: String,
        required: [true, "Name feild is required"],
        minlength: [3, "Name must be at least 3 characters"],
    },
    Surname: {
        type: String,
        required: [true, "Surname field is required"],
        minlength: [3, "Surname must be at least 3 characters"]

    },
    Password: {
        type: String,
        required: [true, "Password field is required"]
    },
    Email: {
        type: String,
        required: [true, "Email field is required"],
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: "Email is Invalid"
        }
    },
    Phonenumber: {
        type: String, 
        required: [true, "Phonenumber field is required"],
        validate: {
            validator: function(v) {
                return validator.isMobilePhone(v, 'tr-TR');
            },
            message: "Phonenumber is Invalid"
        },
        unique: true
    }
})


const employee = model("employee",EmployeeSchema)
module.exports = employee