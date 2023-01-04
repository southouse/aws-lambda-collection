const zlib = require("zlib");
const https = require("https");
const SLACK_ENDPOINT =
  "/services/~~"; // don't use this endpoint, I removed it after publish this post
const SLACK_BOT = "Cloudwatch";

function doRequest(log) {
  const KR_TIME_DIFF = 9 * 60 * 60 * 1000;
  const content = log.logEvents[0];
  const payload = {
    username: SLACK_BOT,
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: "Whoops, looks like something went wrong 😞🤕",
          emoji: true,
        },
      },
      {
              "type": "divider"
          },
      {
        type: "section",
        fields: [
          {
            type: "mrkdwn",
            text: "*Log Group:* " + log.logGroup + "\n" + 
            "*Log Stream:* " + log.logStream + "\n"
          },
          {
            type: "mrkdwn",
            text: "*Message:* _" + content.message + "_"
          }
        ],
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "*Stacktrace:*",
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text:
            "```" +
            "{ \n" + 
            // "   \"id\": \"" + content.id + "\" \n" +
            "   \"timestamp\": " + new Date(content.timestamp + KR_TIME_DIFF).toISOString() + "\n" +
            "   \"message\": \"" + content.message.replace("\n", "") + "\" \n" +
            "}" + 
            "```"
        },
      },
      {
        type: "divider",
      },
    ],
  };

  const payloadStr = JSON.stringify(payload);
  const options = {
    hostname: "hooks.slack.com",
    port: 443,
    path: SLACK_ENDPOINT,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(payloadStr),
    },
  };

  const postReq = https.request(options, function (res) {
    const chunks = [];
    res.setEncoding("utf8");
    res.on("data", function (chunk) {
      return chunks.push(chunk);
    });
    res.on("end", function () {
      if (res.statusCode < 400) {
        console.log("sent!!!");
      } else if (res.statusCode < 500) {
        console.error(
          "Error posting message to Slack API: " +
            res.statusCode +
            " - " +
            res.statusMessage
        );
      } else {
        console.error(
          "Server error when processing message: " +
            res.statusCode +
            " - " +
            res.statusMessage
        );
      }
    });
    return res;
  });
  postReq.write(payloadStr);
  postReq.end();
}

function main(event, context) {
  context.callbackWaitsForEmptyEventLoop = true;

  const payload = Buffer.from(event.awslogs.data, "base64");
  const log = JSON.parse(zlib.gunzipSync(payload).toString("utf8"));

  doRequest(log);

  const response = {
    statusCode: 200,
    body: JSON.stringify("Event sent to Slack!"),
  };
  return response;
}

exports.handler = main;