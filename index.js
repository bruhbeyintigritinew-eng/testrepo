const app = {}

app.get("/user", (req, res) => {
    const connStr = "Server=tcp:myserver.database.windows.net,1433;Initial Catalog=mydb;Persist Security Info=False;User ID=myuser;Password=$uperSecret123!@#";
    const username = req.query.username
    const unsafeQuery = `SELECT * FROM users WHERE username = '${username}'`
    sql.connect(connStr).query(unsafeQuery, (err, result) => {
        res.status(200).send(result)
    })
})
