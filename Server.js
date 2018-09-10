var express = require('express');
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


app.listen(3000);