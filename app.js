//PG-Database
var express = require('express');
var pgp = require('pg-promise')();
//var db = pgp(process.env.DATABASE_URL);
var db = pgp('postgres://futdeidgmwkfof:b0ff7cbc4d68c00baed469b499d82f550bca4995f018702c1c0f7abd185c8d17@ec2-54-83-27-165.compute-1.amazonaws.com:5432/d4j894b34cct4e?ssl=true');
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
    var sql = 'select * from products ';
    if (id) {
        sql += ' where id = ' + id + 'order by id ASC';
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
        db.any('select * from products order by id ASC', )
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
    db.any('select * from users order by id ASC', )
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

    if (id == 'addnewUser') {
        res.render('pages/AddNewUser');
        console.log("if");
    } else {
        var sql = 'select * from users where id =' + id;
        db.any(sql)
            .then(function (data) {
                res.render('pages/UserEdit', { user: data[0] });
            })
            .catch(function (error) {
                console.log('Error :' + error);
            })
        console.log("else");

    }
});
app.post('/users/addnew_user', function (req, res) {
    //หลัง .body. คำนั้นมันมาจาก productAddNew.ejs ตรง id แต่ละตัว
    var id = req.body.idUser;
    var email = req.body.UserEmail;
    var password = req.body.password;
    var date = req.body.datetime;
    //กด alt 9 6 แล้วก็จะได้สัญญาลักษณ์มา
    var sql = `insert into users (id,email,password,created_at) values ('${id}','${email}','${password}','${date}')`;
    db.none(sql)
    console.log('AddNewUser : ' + sql);
    res.redirect('/users');
});
app.post('/users/update', function (req, res) {
    //หลัง .body. คำนั้นมันมาจาก productEdit.ejs ตรง id แต่ละตัว
    var uid = req.body.uid;
    var email = req.body.email;
    var password = req.body.password;
    var date = req.body.datetime;
    //กด alt 9 6 แล้วก็จะได้สัญญาลักษณ์มา
    var sql = `update users set email = '${email}', password = '${password}' , created_at = '${date}' where id = '${uid}' `;
    //เป็นการอัพเดสจริงในดาต้าเบส
    db.none(sql);
    console.log('Update : ' + sql);
    res.redirect('/users');
});
app.get('/users/delete/:pid', function (req, res) {
    var id = req.params.pid;
    var sql = `DELETE FROM users WHERE id ='${id}'`;
    console.log(id);
    db.none(sql);
    console.log("delete :" + sql);
    res.redirect('/users');
});
//เรียก products แค่ตัวเดียวเวลา edit
app.get('/products/:pid', function (req, res) {
    var pid = req.params.pid;
    console.log(pid);
    if (pid == 'addnew') {
        res.render('pages/productAddNew');
        console.log("if");
    } else {
        var sql = 'select * from products where id =' + pid;
        db.any(sql)
            .then(function (data) {
                res.render('pages/productEdit', { product: data[0] });
            })
            .catch(function (error) {
                console.log('Error :' + error);
            })
        console.log("else");
    }
});
//การ  update data of Products
app.post('/products/update', function (req, res) {
    //หลัง .body. คำนั้นมันมาจาก productEdit.ejs ตรง id แต่ละตัว
    var id = req.body.id;
    var title = req.body.title;
    var price = req.body.price;
    var date = req.body.datetime;
    //กด alt 9 6 แล้วก็จะได้สัญญาลักษณ์มา
    var sql = `update products set title = '${title}', price = '${price}' , created_at = '${date}' where id = '${id}' `;
    //เป็นการอัพเดสจริงในดาต้าเบส
    db.none(sql);
    console.log('Update : ' + sql);
    res.redirect('/products');
});
//add new product
app.post('/products/addNewProduct', function (req, res) {
    //หลัง .body. คำนั้นมันมาจาก productAddNew.ejs ตรง id แต่ละตัว
    var id = req.body.idProduct;
    var title = req.body.titleProduct;
    var price = req.body.priceProduct;
    var date = req.body.datetime;
    //กด alt 9 6 แล้วก็จะได้สัญญาลักษณ์มา
    var sql = `insert into products (id,title,price,created_at) values ('${id}','${title}','${price}','${date}')`;
    db.none(sql)
    console.log('AddNewProducts : ' + sql);
    res.redirect('/products');
});
app.get('/products/delete/:pid', function (req, res) {
    var pid = req.params.pid;
    var sql = `DELETE FROM products WHERE id ='${pid}'`;
    db.none(sql);
    console.log("delete :" + sql);
    res.redirect('/products');
});

app.get('/usersreport', function (req, res) {

    db.any('select p.name, u.email , sum(price)  from users u inner join purchases p on u.id = p.user_id inner join purchase_items pi on p.id = pi.purchase_id group by p.name ,u.email having sum(price) > 500 order by sum(price) DESC', )
        .then(function (data) {
            console.log(data)
            res.render('pages/users_report', { data: data });
        })
        .catch(function (error) {
            console.log('Error :' + error);
        })
});
app.get('/productsreport', function (req, res) { 
    db.any('select product.title, sum(product.price) from products product inner join purchase_items pi on product.id = pi.product_id group by product.title order by sum(product.price) DESC',)
    .then(function (data) {
        console.log(data)
        res.render('pages/product_report', { data: data });
    })
    .catch(function (error) {
        console.log('Error :' + error);
    })
});
//ถ้าแอพนี้รันที่ heroku ให้ใช้ตัวนี้ แต่ถ้าไม่ ให้ใช่ port 8080
var port = process.env.PORT || 8080;
app.listen(port, function () {
    console.log('App is running on http://localhost:' + port);
});