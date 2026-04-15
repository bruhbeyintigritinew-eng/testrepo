const https = require("https");

const app = {}

function pendoTrackEvent(event, visitorId, accountId, properties) {
    const data = JSON.stringify({
        type: "track",
        event: event,
        visitorId: visitorId || "system",
        accountId: accountId || "system",
        timestamp: Date.now(),
        properties: properties || {}
    });

    const options = {
        hostname: "data.pendo.io",
        path: "/data/track",
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-pendo-integration-key": "6995da2a-9c68-49a1-84ca-d91216fdefa0"
        }
    };

    try {
        const request = https.request(options);
        request.on("error", (err) => {
            console.error("Pendo track event failed:", err.message);
        });
        request.write(data);
        request.end();
    } catch (err) {
        console.error("Pendo track event failed:", err.message);
    }
}

app.get("/user", (req, res) => {
    const connStr = "Server=tcp:myserver.database.windows.net,1433;Initial Catalog=mydb;Persist Security Info=False;User ID=myuser;Password=$uperSecret123!@#";
    const username = req.query.username
    const unsafeQuery = `SELECT * FROM users WHERE username = '${username}'`
    sql.connect(connStr).query(unsafeQuery, (err, result) => {
        if (err) {
            pendoTrackEvent("User Lookup Failed", username, "system", {
                error_type: err.name || "DatabaseError",
                error_message: (err.message || "").substring(0, 100)
            });
            res.status(500).send({ error: "Query failed" })
            return
        }

        pendoTrackEvent("User Lookup Completed", username, "system", {
            results_count: result ? result.recordset.length : 0
        });

        res.status(200).send(result)
    })
})
