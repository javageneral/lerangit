var express = require('express');
var fs = require('fs');
var querystring = require('querystring');
var app = express();
var mysql = require('mysql');

var pool = mysql.createPool({
	host:'localhost',
	port:3306,
	database:'mysql',
	user:'ax',
	password:'1233'
});

app.get('/ax.html',function(req,res){
	res.writeHead(200,{'Content-Type':'text/html'});
	res.write('<head><meta charset="utf-8"><title>使用post方法向服务器端提交数据</title></head>');
	var file = fs.createReadStream('ax.html');
	file.pipe(res);
});
app.post('/ax.html',function(req,res){
	req.on('data',function(data){
		var obj = querystring.parse(data,toString());
		pool.getConnection(function(err,connection){
			if(err) {res.send(err);}
			else{
				var str;
				connection.query("INSERT INTO user SET ?",{username:obj.username,firstname:obj.firstname},function(err,result){
						if (err)  str = '在服务器端MYSQL数据库插入数据失败';
						else  str = '在服务器端MYSQL数据库插入数据成功';
						connection.release();
						res.send(str);
					});
			}
		});
	});
});
app.listen(8001,'127.0.0.1');