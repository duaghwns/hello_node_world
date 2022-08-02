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

    app.listen(port, ()=> {console.log(`listening on port ${port}`)});
    app.use(bodyParser.urlencoded({ extended : true }));
    
    // home
    app.get('/', (req, res) => {
        db.collection('post').find().toArray((e,data) => {
            if(e) return console.log(e)
            console.log(data)
            res.render('index.ejs', {posts : data})
        })
    })
    
    // user Register
    app.get('/register', (req, res) => {
        res.sendFile(_dirPages + 'register.html')
    })
    app.post('/register', (req, res)=>{
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
    })
    // login
    app.get('/login', (req, res)=>{
        res.sendFile(_dirPages + 'login.html')
    })
    app.post('/login', user.login)
    
    // todo
    app.get('/todo', (req, res) => {
        let postData = db.collection('post').find().toArray((err, data) => {
            if(err) return console.log(err);
            
            console.log(data);
        });
        
        res.render('todo.ejs')
    })

    app.post('/todo', (req, res) => {
        res.send('전송완료')
        db.collection('counter').findOne({name:'todoCounter'},(e,data)=>{
            if(e) return console.log(e)
            const todo = {
                _id : data.totalCount + 1,
                title: req.body.title,
                content : req.body.content,
                date : req.body.date
            }
            saveTodo(todo);

            db.collection('counter').updateOne({name: "todoCounter"}, {$inc:{totalCount: 1}},(e,result)=>{
                if(e) return console.log(e)
                console.log('update!')
                console.log(result)
            })
        })
    })


    // // user Register
    // app.get('/register', user.loadRegister)
    // app.post('/register', user.saveUser)
    // // login
    // app.get('/login', user.loginPage)
    // app.post('/login', user.login)
    
    // // todo
    // app.get('/todo', todo.getTodoList)
    // app.post('/todo', todo.saveTodo)