var express = require('express')
const req = require('express/lib/request')
const res = require('express/lib/response')
const async = require('hbs/lib/async')
var app = express()

app.set('view engine', 'hbs' )
app.use(express.urlencoded({extended:true}))

var MongoClient = require('mongodb').MongoClient
var url = 'mongodb://127.0.0.1/27017'

app.post('/search', async (req,res) => {
    let name = req.body.txtName

    //1. ket noi den server co dia chi trong url
    let server = await MongoClient.connect(url)
    //2. truy cap Database ATNToys
    let dbo = server.db("ATNToys")
    //get data
    let products = await dbo.collection('product').find({'name': new RegExp(name, 'i')}).toArray()
    res.render('allProduct',{'products':products})
})

app.get('/viewAll', async (req,res) => {
    //1. ket noi den server co dia chi trong url
    let server = await MongoClient.connect(url)
    //2. truy cap Database ATNToys
    let dbo = server.db("ATNToys")
    //get data
    let products = await dbo.collection('product').find()
    res.render('allProduct',{'products':products})
})

app.post('/newProduct', async (req,res) => {
    let name = req.body.txtName
    let price = req.body.txtPrice
    let picture = req.body.txtPicture
    let product = {
        'name': name,
        'price': price,
        'picture': picture
    }
    //1. ket noi den server co dia chi trong url
    let server = await MongoClient.connect(url)
    //2. truy cap Database ATNToys
    let dbo = server.db("ATNToys")
    //3. insert product
    await dbo.collection("product").insertOne(product)
    //4. quay lai trang home
    res.redirect('/')
})

app.get('/insert',(req,res) => {
    res.render("newProduct")
})

app.get('/',(req,res) => {
    res.render('home')
})

const PORT = process.env.PORT || 5000
app.listen(PORT)
console.log('Server is running')