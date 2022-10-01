const express = require('express');
const app = express();
const port = 3000;


const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

var cors = require('cors');


const options = {
	swaggerDefinition: {
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


/**
 * @swagger
 * /customers:
 *    get:
 *      description: Return all customers
 *      produces:
 *          - application/json
 *      responses:
 *          200:
 *              description: Object customers containing array of all customers and their attributes
 */
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

/**
 * @swagger
 * /agents:
 *    get:
 *      description: Return all agents
 *      produces:
 *          - application/json
 *      responses:
 *          200:
 *              description: Object agents containing array of all agents and their attributes
 */
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
	
/**
 * @swagger
 * /foods:
 *    get:
 *      description: Return all foods
 *      produces:
 *          - application/json
 *      responses:
 *          200:
 *              description: Object foods containing array of all foods and their attributes
 */
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

/**
 * @swagger
 * /agents/{agentCode}:
 *    get:
 *      description: Return all agents
 *      produces:
 *          - application/json
 *      responses:
 *          200:
 *              description: Object agents containing array of an agent and their attributes after being given an ID 
 */
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

/**
 * @swagger
 * /students:
 *    get:
 *      description: Return all students
 *      produces:
 *          - application/json
 *      responses:
 *          200:
 *              description: Object students containing array of all students and their attributes
 */
	app.get('/students', (req, res) => {
		pool.getConnection()
			.then(conn => {
			
			  conn.query("SELECT * FROM student")
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
app.post('/agent', (req, res) => {
	pool.getConnection()
		.then(conn => {
			conn.query("INSERT INTO agents (`AGENT_CODE`, `AGENT_NAME`, `WORKING_AREA`, `COMMISSION`, `PHONE_NO`, `COUNTRY`) VALUES (?,?,?,?,?,?)", [req.query.agent_code, req.query.agent_name, req.query.working_area, req.query.commission, req.query.phonenumber, req.query.country])
			.then((rows) => {
				res.send('Agent has been added');
			})
			.catch(err => {
			  console.log(err); 
			  conn.end();
			})
			
		}).catch(err => {
		});
	})


//---------------------------------------------------------------------------PATCH REQUESTS:---------------------------------------------------------------------------
const fields = [`AGENT_NAME`, `WORKING_AREA`, `COMMISSION`, `PHONE_NO`, `COUNTRY`];
app.patch('/agent', (req, res) => {
	pool.getConnection()
		.then(conn => {
			let q = "UPDATE agents SET ";
			let params = []
			for (let p in req.query) {
				if (!fields.includes(p)) {
					// THROW ERROR
				}
				const val = p.toUpperCase();
				q += "`" + val + "`=?"
				params.push(req.query[p]);
			}
			params.push(req.query.agent_code);
			q += " WHERE `AGENT_CODE`=?"
			conn.query(q, params)
			.then((rows) => {
				if (rows && rows.affectedRows > 0){
				res.send('Agent has been updated');
			} 
			else {
				res.send('Agent has NOT been updated. Agent not found');
			}

			})
			.catch(err => {
			  res.send(err); 
			  conn.end();
			})
			
		}).catch(err => {
		});
	})

	

//---------------------------------------------------------------------------PUT REQUESTS:---------------------------------------------------------------------------
app.put('/agent', (req, res) => {
	pool.getConnection()
		.then(conn => {
			conn.query("UPDATE agents SET `AGENT_NAME`=?, `WORKING_AREA`=?, `COMMISSION`=?, `PHONE_NO`=?, `COUNTRY`=? WHERE `AGENT_CODE` =?", [req.query.agent_name, req.query.working_area, req.query.commission, req.query.phonenumber, req.query.country, req.query.agent_code])
			.then((rows) => {
				if (rows && rows.affectedRows > 0){
				res.send('Agent has been updated');
			} 
			else {
				res.send('Agent has NOT been updated. Agent not found');
			}

			})
			.catch(err => {
			  res.send(err); 
			  conn.end();
			})
			
		}).catch(err => {
		});
	})

//---------------------------------------------------------------------------DELETE REQUESTS:---------------------------------------------------------------------------
 app.delete('/agent', (req, res) => {
	pool.getConnection()
		.then(conn => {
			console.log('1');
			conn.query("DELETE FROM agents WHERE AGENT_CODE=?", [req.query.agent_code])
			.then((rows) => {
				res.send('Agent has been deleted');
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
