const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

//Require the database model for users
const User = require('./Models/users')

//Require the database model for posts
const Post = require('./Models/posts')



//Middleware's
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors()); //cross origin resource sharing


//Defining the routes for signup page
app.post('/auth/signup', async (req, res) => {
    //checking if user already exists
    User.findOne({ email: req.body.email }, (err, user) => {
        if (user) {
            res.send({ message: '😲 Oops User already exists !' })
        } else {
            const data = new User({
                name: req.body.name,
                email: req.body.email,
                phoneNumber: req.body.phoneNumber,
                password: req.body.password
            })
            data.save(() =>{
                if (err) {
                    res.send(err)
                }
                else{
                    res.send({message: 'User registered successfully'})
                }
            })
        }
    })
})


//routes for user login page
app.post('/login', (req, res) => {
    User.findOne({ email:req.body.email},(err, user) => {
        if (user) {
            if (req.body.password === user.password) {
                res.send({message : 'Logged in successfully!'})
            }else{
                res.send({message : 'Oops Password is incorrect!'})
            }
        }else{
            res.send({message : 'No account found with your email address'})

        }
    })
})


app.post('/add/posts' ,  async (req, res) => {
    let postData = new Post({
        author: req.body.author,
        title: req.body.title,
        summary: req.body.summary,
        imageUrl:req.body.imageUrl,
        location:req.body.location
    })
    try {
        await postData.save()
        res.send({message:'👌 Yay post added successfully'})
    } catch (error) {
        res.send({message:'Oh no! error received while adding post'})
    }
})

app.get('/users' ,async  (req, res) => {
    try {
        const users = await User.find()
        res.json(users)
    } catch (error) {
        console.log(error);
    }
})


  //get the food data from backend to front end
  app.get('/posts',async(req,res)=>{
    try {
     const posts = await Post.find()
     res.json(posts)
    } catch (error) {
      console.log(error);
    }
})



app.get('/posts/:id',async(req,res)=>{
 const {id} = req.params
    try {
       const singlePost = await Post.findById(id)
       res.send(singlePost)
    } catch (error) {
       console.log(error);
    }
})




/*defining Mongodb Url */
const MONGO_URI = 'mongodb://localhost:27017/foodie'

//Connecting to database
mongoose.connect(MONGO_URI).then(() => {
    console.log(`Connection established to database`);
})

//defining port for server
const PORT = process.env.PORT || 1000;


//connection to the server
app.listen(PORT,'localhost', () => {
    console.log(`server is started on ${PORT}`);
})
