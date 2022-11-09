//Sanitation is done in APIs using "?" which are prepared statements and prevent unwanted code/injection/XSS
const express = require("express");
const app = express();
const port = 3000;

const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

var cors = require("cors");
var aws = require("aws-sdk");

const {accessKeyId,secretAccessKey} = require("./config");

const options = {
  swaggerDefinition: {
    info: {
      title: "Week 05 API",
      version: "1.0.0",
      description: "API for week 05 assigment",
    },
    host: "159.223.135.30:3000",
    basePath: "/",
  },
  apis: ["./server.js"],
};
const specs = swaggerJsdoc(options);

app.use("/docs", swaggerUi.serve, swaggerUi.setup(specs));

app.use(cors());

const mariadb = require("mariadb");
const pool = mariadb.createPool({
  host: "localhost",
  user: "root",
  password: "root",
  database: "sample",
  port: 3306,
  connectionLimit: 5,
});

app.get("/", (req, res) => {
  res.send(
    "Welcome to the default site, try urls with /customers or /agents or /foods or /agents/(Agent Code) or /docs for swagger"
  );
});

app.get("/test", (req, res) => {
  res.send("This is a test");
});

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
app.get("/customers", (req, res) => {
  pool
    .getConnection()
    .then((conn) => {
      conn
        .query("SELECT * FROM customer")
        .then((rows) => {
          console.log(rows);
          res.setHeader("Content-Type", "application/json");
          conn.end();
          return res.json(rows);
        })
        .catch((err) => {
          console.log(err);
          conn.end();
        });
    })
    .catch((err) => {});
});

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
app.get("/agents", (req, res) => {
  pool
    .getConnection()
    .then((conn) => {
      conn
        .query("SELECT * FROM agents")
        .then((rows) => {
          console.log(rows);
          res.setHeader("Content-Type", "application/json");
          conn.end();
          return res.json(rows);
        })
        .catch((err) => {
          console.log(err);
          conn.end();
        });
    })
    .catch((err) => {});
});

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
app.get("/foods", (req, res) => {
  pool
    .getConnection()
    .then((conn) => {
      conn
        .query("SELECT * FROM foods")
        .then((rows) => {
          console.log(rows);
          res.setHeader("Content-Type", "application/json");
          conn.end();
          return res.json(rows);
        })
        .catch((err) => {
          console.log(err);
          conn.end();
        });
    })
    .catch((err) => {});
});

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
app.get("/agents/:agentCode", (req, res) => {
  pool
    .getConnection()
    .then((conn) => {
      conn
        .query("SELECT * FROM agents WHERE AGENT_CODE=?", [
          req.params.agentCode,
        ])
        .then((rows) => {
          console.log(rows);
          res.setHeader("Content-Type", "application/json");
          conn.end();
          return res.json(rows);
        })
        .catch((err) => {
          console.log(err);
          conn.end();
        });
    })
    .catch((err) => {});
});

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
app.get("/students", (req, res) => {
  pool
    .getConnection()
    .then((conn) => {
      conn
        .query("SELECT * FROM student")
        .then((rows) => {
          console.log(rows);
          res.setHeader("Content-Type", "application/json");
          conn.end();
          return res.json(rows);
        })
        .catch((err) => {
          console.log(err);
          conn.end();
        });
    })
    .catch((err) => {});
});

//---------------------------------------------------------------------------POST REQUESTS:---------------------------------------------------------------------------

/**
 * @swagger
 * /agent/:
 *    post:
 *      tags:
 *        - Agent
 *      summary: add agents
 *      description: description
 *      parameters:
 *        - in: query
 *          name: agent_code
 *          type: string
 *          description: mention agent code
 *        - in: query
 *          name: agent_name
 *          type: string
 *          description: mention agent name
 *        - in: query
 *          name: working_area
 *          type: string
 *          description: mention working area
 *        - in: query
 *          name: commission
 *          type: string
 *          description: mention COMMISSION
 *        - in: query
 *          name: phonenumber
 *          type: string
 *          description: mention phone number
 *        - in: query
 *          name: country
 *          type: string
 *          description: mention country name
 *      responses:
 *        200:
 *          description: 'Agent Updated'
 */

app.post("/agent", (req, res) => {
  //VALIDATION:
  if (!req.query.phonenumber.match(/^\d{3}-\d{8}$/)) {
    return res.status(400).send({
      message: "Phone number was not valid, please try again   :)",
    });
  }
  pool
    .getConnection()
    .then((conn) => {
      conn
        .query(
          "INSERT INTO agents (`AGENT_CODE`, `AGENT_NAME`, `WORKING_AREA`, `COMMISSION`, `PHONE_NO`, `COUNTRY`) VALUES (?,?,?,?,?,?)",
          [
            req.query.agent_code,
            req.query.agent_name,
            req.query.working_area,
            req.query.commission,
            req.query.phonenumber,
            req.query.country,
          ]
        )
        .then((rows) => {
          res.send("Agent has been added");
        })
        .catch((err) => {
          console.log(err);
          conn.end();
        });
    })
    .catch((err) => {});
});

//---------------------------------------------------------------------------PATCH REQUESTS:---------------------------------------------------------------------------

/**
 * @swagger
 * /agent/:
 *    patch:
 *      tags:
 *        - Agent
 *      summary: patch agents
 *      description: description
 *      parameters:
 *        - in: query
 *          name: agent_code
 *          type: string
 *          description: mention agent code
 *        - in: query
 *          name: agent_name
 *          type: string
 *          description: mention agent name
 *        - in: query
 *          name: working_area
 *          type: string
 *          description: mention working area
 *        - in: query
 *          name: commission
 *          type: string
 *          description: mention COMMISSION
 *        - in: query
 *          name: phonenumber
 *          type: string
 *          description: mention phone number
 *        - in: query
 *          name: country
 *          type: string
 *          description: mention country name
 *      responses:
 *        200:
 *          description: 'Agent patched'
 */
const fields = [
  `AGENT_NAME`,
  `WORKING_AREA`,
  `COMMISSION`,
  `PHONE_NO`,
  `COUNTRY`,
];
app.patch("/agent", (req, res) => {
  pool
    .getConnection()
    .then((conn) => {
      let q = "UPDATE agents SET ";
      let params = [];
      for (let p in req.query) {
        if (p.toUpperCase() == "AGENT_CODE") {
          continue;
        } else if (!fields.includes(p)) {
          //loops through inputed parameters
          continue;
        }
        const val = p.toUpperCase();
        q += "`" + val + "`=?, ";
        params.push(req.query[p]);
      }
      q = q.replace(/,\s*$/, ""); //removes trailing comma using regex
      params.push(req.query.agent_code);
      q += "WHERE `AGENT_CODE`=?";
      conn
        .query(q, params)
        .then((rows) => {
          if (rows && rows.affectedRows > 0) {
            res.send("Agent has been patched");
          } else {
            res.send("Agent has NOT been updated. Agent not found");
          }
        })
        .catch((err) => {
          res.send(err);
          conn.end();
        });
    })
    .catch((err) => {});
});

//---------------------------------------------------------------------------PUT REQUESTS:---------------------------------------------------------------------------
/**
 * @swagger
 * /agent/:
 *    put:
 *      tags:
 *        - Agent
 *      summary: put agents
 *      description: description
 *      parameters:
 *        - in: query
 *          name: agent_code
 *          type: string
 *          description: mention agent code
 *        - in: query
 *          name: agent_name
 *          type: string
 *          description: mention agent name
 *        - in: query
 *          name: working_area
 *          type: string
 *          description: mention working area
 *        - in: query
 *          name: commission
 *          type: string
 *          description: mention COMMISSION
 *        - in: query
 *          name: phonenumber
 *          type: string
 *          description: mention phone number
 *        - in: query
 *          name: country
 *          type: string
 *          description: mention country name
 *      responses:
 *        200:
 *          description: 'Agent put'
 */
app.put("/agent", (req, res) => {
  pool
    .getConnection()
    .then((conn) => {
      conn
        .query(
          "UPDATE agents SET `AGENT_NAME`=?, `WORKING_AREA`=?, `COMMISSION`=?, `PHONE_NO`=?, `COUNTRY`=? WHERE `AGENT_CODE` =?",
          [
            req.query.agent_name,
            req.query.working_area,
            req.query.commission,
            req.query.phonenumber,
            req.query.country,
            req.query.agent_code,
          ]
        )
        .then((rows) => {
          if (rows && rows.affectedRows > 0) {
            res.send("Agent has been updated");
          } else {
            res.send("Agent has NOT been updated. Agent not found");
          }
        })
        .catch((err) => {
          res.send(err);
          conn.end();
        });
    })
    .catch((err) => {});
});

//---------------------------------------------------------------------------DELETE REQUESTS:---------------------------------------------------------------------------

/**
 * @swagger
 * /agent/:
 *    delete:
 *      tags:
 *        - Agent
 *      summary: delete agents
 *      description: description
 *      parameters:
 *        - in: query
 *          name: agent_code
 *          type: string
 *          description: mention agent code
 *      responses:
 *        200:
 *          description: 'delete put'
 */
app.delete("/agent", (req, res) => {
  pool
    .getConnection()
    .then((conn) => {
      console.log("1");
      conn
        .query("DELETE FROM agents WHERE AGENT_CODE=?", [req.query.agent_code])
        .then((rows) => {
          res.send("Agent has been deleted");
        })
        .catch((err) => {
          console.log(err);
          conn.end();
        });
    })
    .catch((err) => {});
});

//---------------------------------------------------------------------------SAY API:---------------------------------------------------------------------------
/**
 * @swagger
 * /say:
 *    get:
 *      description: allows a user to use a function that says something
 *      produces:
 *          - application/json
 *      responses:
 *          200:
 *              description: Returns a function output with what the user wanted to say
 */
app.get("/say", (req, res) => {
  //utilized AWS's github document: https://github.com/awsdocs/aws-doc-sdk-examples/blob/main/javascriptv3/example_code/lambda/actions/invoke.js
  aws.config.update({
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
    region: "us-east-1",
  });
  var lambda = new aws.Lambda();
  var params = {
    FunctionName: "say",
    Payload: JSON.stringify({ keyword: req.query.keyword }),
  };
  lambda.invoke(params, function (err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else console.log(data); // successful response
    res.send(data.Payload);
  });
});

//---------------------------------------------------------------------------AUTO GENERATED APIs USING wrannaman Generator-----------------------------------------------------------------




app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
