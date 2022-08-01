const home = require('./server')
const _dirPages = home._dirPages;
const MongoClient = require('mongodb').MongoClient;
const mongoUrl = 'mongodb+srv://root:root@cluster0.n5blm.mongodb.net/?retryWrites=true&w=majority'
let db;
let saveUser;

    MongoClient.connect(mongoUrl, (err, client) => {
        if(err) return console.log(err);
        
        db = client.db('todoapp');
        
        saveUser = obj => {
            db.collection('user').insertOne(obj, (err,result) => {
                if(err) return console.log(err);
                console.log('저장완료')
                console.log(result);
            });
        }
    });

// Login
exports.login = (req, res) => {
    const id = req.body.id;
    const pw = req.body.pw;
        
    console.log(`id : ${id}`)
    console.log(`pw : ${pw}`)
}

exports.loginPage = (req, res) => {
    res.sendFile(_dirPages + 'login.html')
}

exports.getUser = (req, res)=>{
    
}

// Register
exports.saveUser = (req, res)=>{
    const user = {
        _id: req.body.id,
        name : req.body.name,
        password : req.body.pw,
        birth : req.body.birth,
        email : req.body.email,
        ph : req.body.hp
    }

    if(req.body != null){
        saveUser(user);
    }

    res.sendFile(_dirPages + 'login.html')
}

exports.loadRegister = (req, res) => {
    res.sendFile(_dirPages + 'register.html')
}