// Login
exports.getUser = (req, res)=>{
    
}

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