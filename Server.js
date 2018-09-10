//PG-Database
var express = require('express');
var pgp = require('pg-promise')();
var db = pgp('postgres://nkwnjxuiidwrns:b72b4de42f726173c9acee8a85dd10ed1c8dc1a2ab7402a6feebbbccb8b14f85@ec2-54-163-245-44.compute-1.amazonaws.com:5432/d34ii1v5fr4h1e?ssl=true');
var app = express();

//app.use(express.static('staticWeb'));
app.set('view engine', 'ejs');

app.get('/', function(req, res) {
    res.render('pages/index');
});

app.get('/about', function(req, res) {
    var name = "WaritsaraNC";
    var hobbies = ['music','movie'];
    var bdate = "9/10/1997";
    res.render('pages/about',{fullname : name , hobbies : hobbies , bdate : bdate});
});

//PG database
//display all products
//การททำ Routing คือตรง /
app.get('/products', function(req, res) {
    var id = req.param('id');
    var sql = 'select * from products';
    if(id){
        sql += ' where id = ' + id;

       //code เถื่อน
        /*db.any('select * from products where id='+ id)
        .then(function(data){
        res.render('pages/products',{products : data});
        })
        .catch(function(error){
            console.log('Error :'+error);
        })*/

    }else{

    
    //folder + file
    //res.download('staticWeb/index.html');
    //res.redirect('/about');

    //Database
    db.any('select * from products',)
        .then(function(data){
        res.render('pages/products',{products : data});
        })
        .catch(function(error){
            console.log('Error :'+error);
        })

    }

});

app.get('/users', function(req, res) {
    //folder + file
    //res.download('staticWeb/index.html');
    //res.redirect('/about');

    //Database
    //แสดงข้อมูลในdatabaseออกมา
    db.any('select * from users',)
        .then(function(data){
        res.render('pages/users',{users : data});
        })
        .catch(function(error){
            console.log('Error :'+error);
        })
        
});

//การแสดงข้อมูลแบบทั้งหมดกับแบบตาม id 
app.get('/users/:id', function(req, res) {
    var id = req.params.id;
    var sql = 'select * from users';
    if(id){
        sql += ' where id = ' + id;
    }

   db.any(sql)
        .then(function(data){
        res.render('pages/users',{users : data});
        })
        .catch(function(error){
            console.log('Error :'+error);
        })

});
console.log('App is running at http://localhost:3000/');

app.listen(3000);