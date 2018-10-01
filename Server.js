//PG-Database
var express = require('express');
var pgp = require('pg-promise')();
var db = pgp('postgres://nkwnjxuiidwrns:b72b4de42f726173c9acee8a85dd10ed1c8dc1a2ab7402a6feebbbccb8b14f85@ec2-54-163-245-44.compute-1.amazonaws.com:5432/d34ii1v5fr4h1e?ssl=true');
var app = express();
//เอาข้อมูลที่รับมาจากอะไรก็ชั่ง แปลงให้เป็น json
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//app.use(express.static('staticWeb'));
app.set('view engine', 'ejs');
app.get('/', function (req, res) {
    res.render('pages/index');
});
app.get('/about', function (req, res) {
    var name = "WaritsaraNC";
    var hobbies = ['music', 'movie'];
    var bdate = "9/10/1997";
    res.render('pages/about', { fullname: name, hobbies: hobbies, bdate: bdate });
});
//PG database
//display all products
//การททำ Routing คือตรง /
app.get('/products', function (req, res) {
    var id = req.param('id');
    var sql = 'select * from products';
    if (id) {
        sql += ' where id = ' + id;

        //code เถื่อน
        /*db.any('select * from products where id='+ id)
        .then(function(data){
        res.render('pages/products',{products : data});
        })
        .catch(function(error){
            console.log('Error :'+error);
        })*/

    } else {
        //folder + file
        //res.download('staticWeb/index.html');
        //res.redirect('/about');

        //Database
        db.any('select * from products', )
            .then(function (data) {
                res.render('pages/products', { products: data });
            })
            .catch(function (error) {
                console.log('Error :' + error);
            })
    }

});

app.get('/users', function (req, res) {
    //folder + file
    //res.download('staticWeb/index.html');
    //res.redirect('/about');

    //Database
    //แสดงข้อมูลในdatabaseออกมา
    db.any('select * from users', )
        .then(function (data) {
            res.render('pages/users', { users: data });
        })
        .catch(function (error) {
            console.log('Error :' + error);
        })

});

//การแสดงข้อมูลแบบทั้งหมดกับแบบตาม id 
app.get('/users/:id', function (req, res) {
    var id = req.params.id;
    var sql = 'select * from users';
    if (id) {
        sql += ' where id = ' + id;
    }

    db.any(sql)
        .then(function (data) {
            res.render('pages/users', { users: data });
        })
        .catch(function (error) {
            console.log('Error :' + error);
        })

});

//เรียก products แค่ตัวเดียวเวลา edit
app.get('/products/:pid', function (req, res) {
    var pid = req.params.pid;
    var sql = 'select * from products where id =' + pid;

    db.any(sql)
        .then(function (data) {
            res.render('pages/productEdit', { product: data[0] });
        })
        .catch(function (error) {
            console.log('Error :' + error);
        })


});

//การ  update data of Products
app.post('/products/update', function (req, res) {
    //หลัง .body. คำนั้นมันมาจาก productEdit.ejs ตรง id แต่ละตัว
    var id = req.body.id;
    var title = req.body.title;
    var price = req.body.price;
    //กด alt 9 6 แล้วก็จะได้สัญญาลักษณ์มา
    var sql = `update products set title =  ${title}, price = ${price} where id = ${id}`;

    //db.none เป็นการอัพเดสจริงในดาต้าเบส

    console.log('Update : ' + sql);
    res.redirect('/products');


});
//ถ้าแอพนี้รันที่ heroku ให้ใช้ตัวนี้ แต่ถ้าไม่ ให้ใช่ port 8080
var port = process.env.PORT || 8080;
app.listen(port, function () {
    console.log('App is running on http://localhost:' + port);
});