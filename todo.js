const MongoClient = require('mongodb').MongoClient;
const mongoUrl = 'mongodb+srv://root:root@cluster0.n5blm.mongodb.net/?retryWrites=true&w=majority'
let db;
let saveTodo;

MongoClient.connect(mongoUrl, (err, client) => {
    if(err) return console.log(err);
    db = client.db('todoapp');
    
    saveTodo = obj => {
        db.collection('post').insertOne(obj, (err,result) => {
            if(err) return console.log(err)
            console.log('save!')
            console.log(result)
        });
    }
});
        
        exports.getTodoList = (req,res) => {
            let postData = db.collection('post').find().toArray((err, data) => {
                if(err) return console.log(err);
                
                console.log(data);
            });
            
            res.render('todo.ejs')
        }
        
        exports.saveTodo = (req,res) => {
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
        }
        
        exports.putTodo = (req,res) => {
            
        }
        
        exports.deleteTodo = (req,res) => {
            
        }