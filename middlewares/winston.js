const winston = require("winston");
const path = require("path");
const DailyRotateFile = require("winston-daily-rotate-file");

// create mysql query logger function to log into mysql.log file
exports.mysqlLogger = winston.createLogger({
  transports: [
    new DailyRotateFile({
      filename: path.join(__dirname, "../logs/mysql/mysql.log"),
      dirname: path.join(__dirname, "../logs/mysql"),
      zippedArchive: true,
      maxSize: "5m",
      maxFiles: "30d",
      level: "info",
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf((info) => `${info.timestamp} ${info.message}`)
      ),
    }),
  ],
});

// create logger to save error logs into log file
exports.logger = winston.createLogger({
  transports: [
    new DailyRotateFile({
      filename: path.join(__dirname, "../logs/errors/error.log"),
      dirname: path.join(__dirname, "../logs/errors"),
      zippedArchive: true,
      maxSize: "5m",
      maxFiles: "30d",
      level: "error",
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
    }),
  ],
});

exports.logAPICalls = (req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    if (res.statusCode >= 400 && res.statusCode < 600) {
      const responseTime = Date.now() - start;
      this.logger.error({
        method: req.method,
        url: req.url,
        statusCode: res.statusCode,
        statusMessage: res.statusMessage,
        responseTime: `${responseTime}ms`,
        headers: req.headers,
        query: req.query,
        params: req.params,
        body: req.body,
        response: res.body,
        errorMessage: "",
        errorStack: null,
      });
    }
  });
  next();
};

exports.errorHandler = (err, req, res, next) => {
  this.logger.error({
    method: req.method,
    url: req.url,
    statusCode: err?.statusCode || 500,
    statusMessage: "",
    responseTime: ``,
    headers: req.headers,
    query: req.query,
    params: req.params,
    body: req.body,
    response: res.body,
    errorMessage: err?.message,
    errorStack: err?.stack,
  });
  console.log("errorHandler Error", err);
  res.status(err?.statusCode || 500).json({
    status: false,
    message: err?.message || `Something went wrong! Please try after sometime.`,
  });
};
