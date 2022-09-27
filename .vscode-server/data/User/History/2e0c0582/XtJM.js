const express = require('express');
const app = express();
const port = 3000;


const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const cors = require('cors');


const options = {
	swaggerDefenition: {
	info: {
		title: 'Week 05 API',
		version: '1.0.0',
		description: 'API for week 05 assigment'
	},
	host: 'localhost:3000',
	basePath: '/',
	},
	apis: ['./server.js'],
};
const specs = swaggerJsdoc(options);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs));

app.use(cors());

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
res.send('Welcome to the default site, try urls with /customers or /agents or /foods or /agents/(Agent Code)');
})

app.get('/test', (req, res) => {
	res.send('This is a test');
	})

//---------------------------------------------------------------------------GET REQUESTS:---------------------------------------------------------------------------

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


		app.get('/agents/:agentCode', (req, res) => {
			pool.getConnection()
				.then(conn => {
				
					conn.query("SELECT * FROM agents WHERE AGENT_CODE=?", [req.params.agentCode])
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


//---------------------------------------------------------------------------POST REQUESTS:---------------------------------------------------------------------------


//---------------------------------------------------------------------------PATCH REQUESTS:---------------------------------------------------------------------------


//---------------------------------------------------------------------------PUT REQUESTS:---------------------------------------------------------------------------


//---------------------------------------------------------------------------DELETE REQUESTS:---------------------------------------------------------------------------


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})