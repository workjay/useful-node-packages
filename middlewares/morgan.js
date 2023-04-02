const FileStreamRotator = require("file-stream-rotator");
const path = require("path");

// This function save api request logs into log file
exports.morganRotatingLogStream = FileStreamRotator.getStream({
  filename: path.join(__dirname, "../logs/api_request/api-request-%DATE%"),
  frequency: "daily",
  date_format: "YMD",
  size: "5m",
  max_logs: "30d",
  audit_file: path.join(__dirname, "../logs/api_request/audit.json"),
  extension: ".log",
  file_options: {
    flags: "a",
  },
});
