const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const _dirPages = __dirname + '/pages/'
const port = 8080;
const mongoUrl = 'mongodb+srv://root:root@cluster0.n5blm.mongodb.net/?retryWrites=true&w=majority'
let db;
let saveUser;

MongoClient.connect(mongoUrl, (err, client) => {
    if(err) return console.log(err);
    
    db = client.db('todoapp');
    
    saveUser = (userObj)=>{
        db.collection('user').insertOne(userObj, (err,result) => {
            if(err) return console.log(err);
            console.log('저장완료')
            console.log(result);
        });
    }
})

app.listen(port, ()=> {
    console.log(`listening on port ${port}`)
});
app.use(bodyParser.urlencoded({ extended : true }));
    
    
    app.get('/', (req, res) => {
        res.sendFile(_dirPages + 'index.html')
    })
    
    app.get('/login', (req, res) => {
        res.sendFile(_dirPages + 'login.html')
    })
    
    app.post('/login', (req, res) => {
        const id = req.body.id;
        const pw = req.body.pw;
        
        console.log(`id : ${id}`)
        console.log(`pw : ${pw}`)
        
    })

    app.get('/register', (req, res) => {
        res.sendFile(_dirPages + 'register.html')
    })

    app.post('/register', (req, res) => {
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
    })