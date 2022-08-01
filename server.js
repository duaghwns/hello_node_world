const express = require('express');
const app = express();
const user = require('./js/user');

// npm install nodemon
// npm install mongodb
// npm install body-parser
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const _dirPages = __dirname + '/pages/'
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
    
    app.get('/login', (req, res) => {
        res.sendFile(_dirPages + 'login.html')
    })

    app.get('/todo', (req, res) => {

        let postData = db.collection('post').find().toArray((err, data) => {
            if(err) return console.log(err);

            console.log(data);
        });

        res.render('todo.ejs')
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

    app.post('/register', user.saveUser)

    app.post('/todo', (req, res)=>{
        db.collection('counter').findOne('todoCounter',(e,data)=>{
            if(e) return console.log(e)
            console.log(data.name)
            const todo = {
                _id : data.totalCount + 1,
                title: req.body.title,
                content : req.body.content,
                date : req.body.date
            }
            saveTodo(todo);
        })
    })