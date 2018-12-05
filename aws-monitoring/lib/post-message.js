const https = require("https");

module.exports = content => {
  const postData = {
    channel: "#aws-alerts",
    username: "AWS Notifier",
    text: `${content}`
  };
  const options = {
    method: "POST",
    hostname: "hooks.slack.com",
    port: 443,
    path: process.env.WEBHOOK_PATH || ''
  };

  const req = https.request(options, function(res) {
    res.setEncoding("utf8");
  });

  req.on("error", function(e) {
    console.log("problem with request: " + e.message);
  });

  req.write(JSON.stringify(postData));
  req.end();
};
