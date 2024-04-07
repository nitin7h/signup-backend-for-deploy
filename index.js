require('dotenv').config()
const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")







const { tokenGenrator, verifyToken } = require("./jwt")



const Port = process.env.PORT || 7000

const app = express()







app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors())






mongoose.connect(process.env.DataBaseUrl)
    .then(() => { console.log("Mongodb Connected...") })
    .catch((error) => {
        console.log("Mongo error " + error);
    })

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
})

const User = new mongoose.model("User", userSchema)


app.get("/", (req, res) => {
    res.send("Hi from Server")
})
app.post("/signUp", async(req, res) => {

    console.log(req.body);
    const { name, email, password } = req.body

    const userAllreadyExist = await User.findOne({ email })

    if (!userAllreadyExist) {
        const user = new User({
            name: name,
            email: email,
            password: password,
        })

        user.save()
        res.send({ message: "Data Posted Succesfully" })
    } else {
        res.send({ message: "User Already Exist " })
    }

})

app.post("/signin", async(req, res) => {
    const { email, password } = req.body
    const userExist = await User.findOne({ email, password })

    const token = tokenGenrator(userExist)

    if (!userExist) {
        res.send({ message: "Invalid Email or Password" })
    }

    if (userExist) {
        console.log("token : ", token);
        return res.send({ message: "Succesfully login", token })

    }



})


app.get('/verificationsignin', verifyToken, (req, res) => {
    // Access req.userId to get the user ID
    res.status(200).send("You're authenticated!");
});


app.listen(Port, () => { console.log(`Port listening on  http://localhost:${Port} `) })