const express = require('express');
var cors = require('cors')
const app = express();
const port = 3000;

app.use(cors())

const mariadb = require('mariadb');
const pool = mariadb.createPool({
	host: 'localhost',
	user: 'root',
	password: 'root',
	database: 'sample',
	port: 3306,
	connectionLimit: 5
});


app.get('/', (req, res) => {
res.send('Welcome to the default site, try urls with /customers or /agents or /foods or /agents/(Agent Code) or /.......... or /..........');
})

// app.get('/customers', (req, res) => {
// 	pool.getConnection()
// 		.then(conn => {
// 			const query = "SELECT * FROM customer";

// 			conn.query(query, function(error, rows) {
// 				res.setHeader('Content-Type', 'application/json');
// 				return res.json(rows);
// 			})
// 		})
// })

app.get('/customers', (req, res) => {
pool.getConnection()
    .then(conn => {
    
      conn.query("SELECT * FROM customer")
        .then((rows) => {
          console.log(rows);
		  res.setHeader('Content-Type', 'application/json');
		  conn.end();
		  return res.json(rows);
          
        })
        .catch(err => {
          console.log(err); 
          conn.end();
        })
        
    }).catch(err => {
    });
})

app.get('/agents', (req, res) => {
	pool.getConnection()
		.then(conn => {
		
		  conn.query("SELECT * FROM agents")
			.then((rows) => {
			  console.log(rows);
			  res.setHeader('Content-Type', 'application/json');
			  conn.end();
			  return res.json(rows);
			  
			})
			.catch(err => {
			  console.log(err); 
			  conn.end();
			})
			
		}).catch(err => {
		});
	})

	app.get('/foods', (req, res) => {
		pool.getConnection()
			.then(conn => {
			
			  conn.query("SELECT * FROM foods")
				.then((rows) => {
				  console.log(rows);
				  res.setHeader('Content-Type', 'application/json');
				  conn.end();
				  return res.json(rows);
				  
				})
				.catch(err => {
				  console.log(err); 
				  conn.end();
				})
				
			}).catch(err => {
			});
		})


		app.get('/agents/:agentName', (req, res) => {
			pool.getConnection()
				.then(conn => {
				
					conn.query("SELECT * FROM agents WHERE AGENT_CODE=?", [req.params.paramName])
					.then((rows) => {
					  console.log(rows);
					  res.setHeader('Content-Type', 'application/json');
					  conn.end();
					  return res.json(rows);
					  
					})
					.catch(err => {
					  console.log(err); 
					  conn.end();
					})
					
				}).catch(err => {
				});
			})


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
