var fs = require('fs')
const { exec } = require('child_process');

var mysql      = require('mysql');

var lines = fs.readFileSync('ip.list').toString().split('\n')
var creds = fs.readFileSync('creds').toString().trim().split(':')

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : creds[0],
  password : creds[1],
  database : 'database'
});

function ping(host) {
	return new Promise((resolve, reject) => {
		exec(`ping -w 1 -c 1 ${host}`, (e, so, se) => {
			var r = { 
				alive: false,
				time: -1
			}
			r.ipv4 = host;
			if (e || se) {
				resolve(r)
				return;
			}
			if (so) {
				var tok = so.split(' ');
				r.time = tok[12].split('=')[1] 
				r.time = r.time ? r.time : -1
				r.alive = true;
				resolve(r)
			}
		});
	})
	
}


function rnd(array) {
	return array[Math.floor(Math.random() * array.length-1)]
}

//console.log(rnd(lines));
(async () => {

for(var i = 0; i <  64; i++) {
(async () => {
while (true) {
	
		try {
		var host = rnd(lines);
		console.log(host)
	 
		var r = await ping(host)
		console.log(r)
		connection.query('INSERT INTO `hosts` (ipv4, alive, time) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE alive=?, time=?', [
			r.ipv4,
			r.alive,
			r.time,
			r.alive,
			r.time
		], (e) => {
			if (e) console.log(e)
		}) 
		
		} catch(e) { 
		
		}
	}
	})()
}
})()
