// Load env variables
require("dotenv").config();

// Express App
const express = require("express");
const app = express();

// Variables
const PORT = process.env.PORT;

// Default route
app.get("/", (req, res) => {
  res.status(200).send(`<h1>Welcome to useful packages project</h1>`);
});

// morgan configurations to print api request logs
const morgan = require("morgan");
// Print api request log into terminal.
// here we are used dev format to print logs into terminal because it's print quick overview about user request with colorful output
app.use(morgan("dev"));
// Add api request logs into log file.
// here we are used combined format to add as much as possible details of user request into log file
const { morganRotatingLogStream } = require("./middlewares/morgan");
app.use(
  morgan("combined", {
    stream: morganRotatingLogStream,
  })
);

// winston configuration to store api error logs into file
const { logAPICalls, errorHandler } = require("./middlewares/winston");
app.use(logAPICalls);

// winston configuration to store error logs into file and send response to the users
app.use(errorHandler);

// Start server to listen user request on your port
app.listen(PORT, () => {
  console.log(
    `Server is start listing on port: ${PORT}. Visit http://localhost:${PORT}`
  );
});
