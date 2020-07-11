//use path module
const path = require('path');
//use express module
const express = require('express');
//use hbs view engine
const hbs = require('hbs');
//use bodyParser middleware
const bodyParser = require('body-parser');
const session = require('express-session');
//use mysql database
const mysql = require('mysql');
const { request } = require('http');
const { response } = require('express');
const app = express();


//Create Connection
const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'profilecompany_db'
});

//connect to database
conn.connect((err) => {
    if (err) throw err;
    console.log('Mysql Connected...');
});




//set views file
app.set('views', path.join(__dirname, 'views'));
//set view engine
app.set('view engine', 'hbs');

// set session
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}))

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
//set folder public as static folder for static file
app.use('/assets', express.static(__dirname + '/public'));

// Awal Index

//Nampilin Data
app.get('/', (req, res) => {

    let sql = "SELECT * FROM product";
    let query = conn.query(sql, (err, results) => {
        if (err) throw err;
        res.render('index', {
            hasil: results
        });
    });
});


// Akhir Index


// Awal Dashboard

app.get('/dashboard', (req, res) => {

    let sql ="SELECT COUNT(id_user) as jumlah_user FROM user";
    let query = conn.query(sql, (err, results) => {
        if (err) throw err;
        res.render('dashboard', {
            user: results
        });
    });
});

app.get('/dashboard', (req, res) => {

    let sql = "SELECT COUNT(id_user) as jumlah FROM user" ;
    let query = conn.query(sql, (err, results) => {
        if (err) throw err;
        res.render('dashboard', {
            produk: results
        });
    });
});


// Akhir Dashboard 

//Awal Login

app.get('/login', (req, res) => {
        res.render('login');
});

app.post('/auth', function(request, response) {
	const username = request.body.username;
	const password = request.body.password;
	if (username && password) {
		conn.query('SELECT * FROM user WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
			if (results.length > 0) {
				request.session.loggedin = true;
				request.session.username = username;
				response.redirect('dashboard');
			} else {
				return response.render('login', {
                    message : 'Password atau username salah'
                })
			}			
			response.end();
		});
	} else {
		return response.render('login', {
            message : 'Masukkan assword atau username'
        })      
		response.end();
	}
});

//Akhir login


//Awal User

//Nampilin Data
app.get('/user', (req, res) => {
    let sql = "SELECT * FROM user";
    let query = conn.query(sql, (err, results) => {
        if (err) throw err;
        res.render('user', {
            results: results
        });
    });
});

//route for insert data
app.post('/saveuser', (req, res) => {
    let data = {
        nama: req.body.nama,
        username: req.body.username,
        password: req.body.password
    };
    let sql = "INSERT INTO user SET ?";
    let query = conn.query(sql, data, (err, results) => {
        if (err) throw err;
        res.redirect('user');
    });
});

//route for update data
app.post('/updateuser', (req, res) => {
    let sql = "UPDATE user SET nama='" + req.body.nama + "', username='" + req.body.username + "' , password='" + req.body.password + "' WHERE id_user=" + req.body.id;
    let query = conn.query(sql, (err, results) => {
        if (err) throw err;
        res.redirect('user');
    });
});

//route for delete data
app.post('/deleteuser', (req, res) => {
    let sql = "DELETE FROM user WHERE id_user=" + req.body.id_user + "";
    let query = conn.query(sql, (err, results) => {
        if (err) throw err;
        res.redirect('user');
    });
});

//Akhir User


//Awal Product

//Nampilin Data
app.get('/product', (req, res) => {
    let sql = "SELECT * FROM product";
    let query = conn.query(sql, (err, results) => {
        if (err) throw err;
        res.render('product', {
            results: results
        });
    });
});

//route for insert data
app.post('/saveproduct', (req, res) => {
    let data = {
        nama_product: req.body.nama_product,
        harga_product: req.body.harga_product,
        deskripsi_product: req.body.deskripsi_product
    };
    let sql = "INSERT INTO product SET ?";
    let query = conn.query(sql, data, (err, results) => {
        if (err) throw err;
        res.redirect('product');
    });
});

//route for update data
app.post('/updateproduct', (req, res) => {
    let sql = "UPDATE product SET nama_product='" + req.body.nama_product + "', harga_product='" + req.body.harga_product + "' , deskripsi_product='" + req.body.deskripsi_product + "' WHERE id_product=" + req.body.id;
    let query = conn.query(sql, (err, results) => {
        if (err) throw err;
        res.redirect('product');
    });
});

//route for delete data
app.post('/deleteproduct', (req, res) => {
    let sql = "DELETE FROM product WHERE id_product=" + req.body.id_product + "";
    let query = conn.query(sql, (err, results) => {
        if (err) throw err;
        res.redirect('product');
    });
});

//Akhir Product


// Awal Daftar Product

//Nampilin Data
app.get('/daftar_product', (req, res) => {
    let sql = "SELECT * FROM product";
    let query = conn.query(sql, (err, results) => {
        if (err) throw err;
        res.render('daftar_product', {
            produk: results
        });
    });
});

// Akhir Daftar Product

// Awal detail produk
app.get('/detail_product', (req, res) => {
    let sql = "SELECT * FROM product";
    let query = conn.query(sql, (err, results) => {
        if (err) throw err;
        res.render('detail_product', {
            produk: results
        });
    });
});
// Akhir detail produk

//Awal Team

//Nampilin Data
app.get('/team', (req, res) => {
    let sql = "SELECT * FROM team";
    let query = conn.query(sql, (err, results) => {
        if (err) throw err;
        res.render('team', {
            results: results
        });
    });
});

//route for insert data
app.post('/saveteam', (req, res) => {
    let data = {
        nama_team: req.body.nama_team,
        job_desc: req.body.job_desc,
        deskripsi_team: req.body.deskripsi_team
    };
    let sql = "INSERT INTO team SET ?";
    let query = conn.query(sql, data, (err, results) => {
        if (err) throw err;
        res.redirect('team');
    });
});

//route for update data
app.post('/updateteam', (req, res) => {
    let sql = "UPDATE team SET nama_team='" + req.body.nama_team + "', job_desc='" + req.body.job_desc + "' , deskripsi_team='" + req.body.deskripsi_team + "' WHERE id_team=" + req.body.id;
    let query = conn.query(sql, (err, results) => {
        if (err) throw err;
        res.redirect('team');
    });
});

//route for delete data
app.post('/deleteteam', (req, res) => {
    let sql = "DELETE FROM team WHERE id_team=" + req.body.id_team + "";
    let query = conn.query(sql, (err, results) => {
        if (err) throw err;
        res.redirect('team');
    });
});


//Akhir Team


//Awal Pesan

//Nampilin Data
app.get('/pesan', (req, res) => {
    let sql = "SELECT * FROM pesan";
    let query = conn.query(sql, (err, results) => {
        if (err) throw err;
        res.render('pesan', {
            results: results
        });
    });
});

//route for insert data
app.post('/savepesan', (req, res) => {
    let data = {
        nama: req.body.nama,
        email: req.body.email,
        subject: req.body.subject,
        message: req.body.message
    };
    let sql = "INSERT INTO pesan SET ?";
    let query = conn.query(sql, data, (err, results) => {
        if (err) throw err;
        res.redirect('/');
    });
});


//route for delete data
app.post('/deletepesan', (req, res) => {
    let sql = "DELETE FROM pesan WHERE id_pesan=" + req.body.id_pesan + "";
    let query = conn.query(sql, (err, results) => {
        if (err) throw err;
        res.redirect('pesan');
    });
});

//Akhir Pesan




//server listening
app.listen(8080, () => {
    console.log('Server is running at port 8080');
});