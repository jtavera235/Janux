const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const userRoutes = require("./routes/users");
const startupRoutes = require("./routes/startups");
const investorRoutes = require("./routes/investor");
const rateLimit = require("express-rate-limit");
const debug = require("debug")("node-angular");
const http = require("http");

mongoose.connect("mongodb+srv://jtavera235:" + process.env.MONGO_ATLAS_PW + "@cluster0-ukqid.mongodb.net/janux?retryWrites=true&w=majority").then(() => {
    console.log("conection success");
}).catch(() => {
    console.log('connection failed ');
});
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
//jCJJ6ywYExZNTl4t

const limiter = rateLimit({
    windowMs: 25 * 60 * 1000,
    max: 20
});


const normalizePort = val => {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
};

const onError = error => {
  if (error.syscall !== "listen") {
    throw error;
  }
  const bind = typeof port === "string" ? "pipe " + port : "port " + port;
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
};

const onListening = () => {
  const addr = server.address();
  const bind = typeof port === "string" ? "pipe " + port : "port " + port;
  debug("Listening on " + bind);
};

const port = normalizePort(process.env.PORT || "3000");
console.log("sevrer is listening on " + port);
app.set("port", port);

const server = http.createServer(app);
server.on("error", onError);
server.on("listening", onListening);
server.listen(port);




app.use(limiter);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
    next();
});




app.use("/api/startups", startupRoutes);
app.use("/api/users", userRoutes);
app.use("/api/investors", investorRoutes);
module.exports = app;