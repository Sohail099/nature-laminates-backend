const logger = require("../utils/other/logger")

module.exports.sendWarningToSlack = async (req, res, data) => {
    logger.info("sendWarningToSlack called");
    const URL = process.env.API_FAILURE_SLACK_WEBHOOK_URL;
    console.log("SLACK URL : ", URL)
    data = JSON.parse(data)
    let message = data.message;

    let body = {
        "text": "Danny Torrence left a 1 star review for your property.",
        "blocks": [
            {
                "type": "section",
                "block_id": "section1",
                "fields": [
                    {
                        "type": "mrkdwn",
                        "text": `*Url:* ${req.originalUrl}`
                    }
                ]
            },
            {
                "type": "section",
                "block_id": "section2",
                "fields": [
                    {
                        "type": "mrkdwn",
                        "text": `*StatusCode:* ${res.statusCode}`
                    }
                ]
            },
            {
                "type": "section",
                "block_id": "section3",
                "fields": [
                    {
                        "type": "mrkdwn",
                        "text": `*Status:* error`
                    }
                ]
            },
            {
                "type": "section",
                "block_id": "section4",
                "fields": [
                    {
                        "type": "mrkdwn",
                        "text": `*Message:* ${message}`
                    }
                ]
            },
        ]
    }
    fetch(URL, {
        body: JSON.stringify(body),
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        }
    }).then((res) => res.text())
        .then(data => {
            console.log("Resp Data : ", data);

        })
        .catch(error => {
            console.log("Resp Error ; ", error);
        })
}