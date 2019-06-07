// an app to extract countries data
const db = require("./db");

const URL = "https://scrapethissite.com/pages/simple/";

const scrapper = require("./scrapper");
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();



let countries = db.get("countries").value();

//server
const PORT = 8080;
app.use(express.static(path.join(__dirname, `build`)));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) =>
    res.sendFile(path.join(__dirname, "dist/index.html"))
);

app.get("/countries", (req, res) => {
    res.json(countries);
});

app.get("/refresh", (req, res) => {
    scrapper.getData(URL).then(data => {
        db.get("countries")
            .push(...data)
            .write();
        // update db count
        db.update("count", n => n + 1);
    });
});
app.post("/delete", (req, res) => {
    const newState = {
        countries: [],
        count: 0
    };
    db.setState(newState);
    db.write()
        .then(() => res.sendStatus(200))
        .catch(() => res.sendStatus(500));
});

app.listen(PORT, () => console.log(`app is running on port ${PORT}`));
