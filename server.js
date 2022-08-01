const express = require('express');
const app = express();
const user = require('./user');
const todo = require('./todo');

// npm install nodemon
// npm install mongodb
// npm install body-parser
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
exports._dirPages = __dirname + '/pages/'
const port = 8080;
const mongoUrl = 'mongodb+srv://root:root@cluster0.n5blm.mongodb.net/?retryWrites=true&w=majority'
// ejs 사용
app.set('view engine', 'ejs');

let db;
let saveUser;
let saveTodo;

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

        saveTodo = obj => {
            db.collection('post').insertOne(obj, (err,result) => {
                if(err) return console.log(err)
                console.log('save!')
                console.log(result)
            });
        }
    })

    app.listen(port, ()=> {
        console.log(`listening on port ${port}`)
    });

    app.use(bodyParser.urlencoded({ extended : true }));
    
    
    app.get('/', (req, res) => {
        let postData = db.collection('post').find().toArray((e,data) => {
            if(e) return console.log(e)
            console.log(data)
            res.render('index.ejs', {posts : data})
        })
    })
    
    // user Register
    app.get('/register', user.loadRegister)
    app.post('/register', user.saveUser)
    // login
    app.get('/login', user.loginPage)
    app.post('/login', user.login)
    
    // todo
    app.get('/todo', todo.getTodoList)
    app.post('/todo', todo.saveTodo)