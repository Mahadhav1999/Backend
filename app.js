const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

//defining port for server
const PORT = 4000;

//Require the database model for users
const User = require('./Models/users')

//Middleware's
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors()); //cross origin resource sharing


//Defining the routes for signup page
app.post('/auth/signup', async (req, res) => {

    //checking if user already exists
    User.findOne({ email: req.body.email }, (err, user) => {
        if (user) {
            res.send({ message: 'User already exists with this email address' })
        } else {
            const data = new User({
                name: req.body.name,
                mobile: req.body.mobile,
                email: req.body.email,
                password: req.body.password,
            })
            data.save(() =>{
                if (err) {
                    res.send(err)
                }
                else{
                    res.send({message: 'User created successfully'})
                }
            })
        }
    })
})




/*defining Mongodb Url */
const MONGO_URI = 'mongodb://127.0.0.1:27017/Xomato'

mongoose.set('strictQuery', false)
//Connecting to database
mongoose.connect(MONGO_URI).then(() => {
    console.log(`Connection established to database`);
})



//connection to the server
app.listen(PORT, () => {
    console.log(`server is started on ${PORT}`);
})
