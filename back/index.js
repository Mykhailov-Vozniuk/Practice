const mongoose = require('mongoose')
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const app = express()
const jwt = require('jsonwebtoken')
const expressJwt = require('express-jwt')

mongoose.connect('mongodb://localhost/practicedb', {useNewUrlParser: true})

var db = mongoose.connection

var userSchema = new mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	name: String,
	login: String,
	password: String
})

var User = mongoose.model('User', userSchema)

const secret = 'jwtSecret'

function jwtWare() {
	return expressJwt({secret}).unless({
		path:[
			'/',
			'register',
			'login'
		]
	})
}

async function test () {
	let users =	await User.find({})
	console.log(users)
}

test()

app.use(bodyParser.json({limit: '1mb', extended: true}))
app.use(cors())

app.post("/register", async (req, res) => {
	console.log(req.body)
	if(await User.findOne({login: req.body.login})){
		res.status(409).json('User already exist')
	}
	else{
		let newUser = new User(req.body)
		newUser._id = new mongoose.Types.ObjectId()
		await newUser.save()
		let {password, ...userInfo} = newUser.toObject()
		res.status(201).json(userInfo)
	}
})

app.post("/login", async (req, res) => {
	let user
	if(req.headers.authorization.substr("Bearer ".length).length > 4){
		let token = req.headers.authorization.substr("Bearer ".length)
    	let decoded = jwt.verify(token, secret)
    	user = await User.findOne({_id: decoded.user._id})
	}
	else {
		if (req.body.password) {
			user = await User.findOne(req.body)
		}
	}
	if(user) {
		let {password, ads, ...userInfo} = user.toObject()
		const token = jwt.sign({user: userInfo}, secret)
		res.status(201).json(token)
	}
	else{
		res.status(404).json('login or password is not correct')
	}
})

db.on('error', console.error.bind(console, 'connection error:'))

db.once('open', function() {
});

app.get("/", async (req, res) => {
	res.send('Practice')
})

app.listen(4000, function () {
})