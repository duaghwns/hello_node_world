const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const _dirPages = __dirname + '/pages/'
const mongoUrl = 'mongodb+srv://root:root@cluster0.n5blm.mongodb.net/?retryWrites=true&w=majority'

// ejs 사용
const app = express();
const port = 8080;
app.set('view engine', 'ejs');

let db;

let _post;
let _user;
let _counter;

let saveUser;
let saveTodo;

MongoClient.connect(mongoUrl, (err, client) => {
    if(err) return console.log(err);
    
    db = client.db('todoapp');

    _post = db.collection('post');
    _user = db.collection('user');
    _counter = db.collection('counter');

    saveUser = obj => {
        _user.insertOne(obj, (err,result) => {
            if(err) return console.log(err);
            console.log('저장완료')
        });
    }

    saveTodo = obj => {
        _post.insertOne(obj, (err,result) => {
            if(err) return console.log(err)
            console.log('save!')
        });
    }
})

    app.listen(port, ()=> {console.log(`listening on port ${port}`)});
    
    // 없으면 css link 안됌
    app.use(express.static(__dirname + '/pages'))
    app.use(bodyParser.urlencoded({ extended : true }));

    // home
    app.get('/', (req, res) => {
        _post.find().toArray((e,data) => {
            if(e) return console.log(e)
            res.render('index.ejs', {posts : data})
        })
    })
    
    // user Register
    app.get('/register', (req, res) => {
        console.log(_dirPages)
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
    app.post('/login', (req, res) => {
        const id = req.body.id;
        const pw = req.body.pw;
            
        console.log(`id : ${id}`)
        console.log(`pw : ${pw}`)
    })
    
    // todo
    app.get('/todo', (req, res) => {
        let postData = db.collection('post').find().toArray((err, data) => {
            if(err) return console.log(err);
        });
        
        res.render('todo.ejs')
    })

    app.post('/todo', (req, res) => {
        _counter.findOne({name:'todoCounter'},(e,data)=>{
            if(e) return console.log(e)
            const todo = {
                _id : data.totalCount + 1,
                title: req.body.title,
                content : req.body.content,
                date : req.body.date
            }
            saveTodo(todo);

            _counter.updateOne({name: "todoCounter"}, {$inc:{totalCount: 1}},(e,result)=>{
                if(e) return console.log(e)
                console.log('update!')
                _post.find().toArray((e,data) => {
                    if(e) return console.log(e)
                    res.render('index.ejs', {posts : data})
                })
            })
        })
    })

    app.delete('/delete', (req, res) => {
        console.log(req.body)
        req.body._id = parseInt(req.body._id,);
        _post.deleteOne(req.body, (err, result) => {
            if(err) return console.log(err)
            res.status(200).send({message: '성공했습니다'});
        })
    })

    app.get('/detail/:id', (req, res) => {
        console.log(req.params.id)
        _post.findOne({ _id : parseInt(req.params.id) },(e, result)=>{
            if(e) return console.log(e)
            res.render('view.ejs',{data : result})
        })
    });

    app.get('/edit/:id', (req, res) => {
        console.log(req.params.id);

        _post.findOne({ _id : parseInt(req.params.id) },(e, result) => {
            if(e) return console.log(e)
            res.render('edit.ejs',{data : result});
        });
    });

    app.post('/edit/:id', (req, res) => {
        const d_id = parseInt(req.params.id);

        const todo = {
            _id : d_id,
            title : req.body.title,
            content : req.body.content,
            date : req.body.date
        }
        console.log(todo)
        _post.updateOne({_id : d_id}, {$set:todo}, (err,result) => {
            if(err) return console.log(err);
            console.log('update!')

            _post.find().toArray((e,data) => {
                if(e) return console.log(e)
                res.render('index.ejs', {posts : data})
            })
        });

    });

    // // user Register
    // app.get('/register', user.loadRegister)
    // app.post('/register', user.saveUser)
    // // login
    // app.get('/login', user.loginPage)
    // app.post('/login', user.login)
    
    // // todo
    // app.get('/todo', todo.getTodoList)
    // app.post('/todo', todo.saveTodo)