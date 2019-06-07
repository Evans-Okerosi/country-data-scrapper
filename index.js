// an app to extract countries data
const db = require("./db");

const URL = "https://scrapethissite.com/pages/simple/";

const scrapper = require("./scrapper");
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();

function getData() {
    scrapper
        .fetchData(URL)
        .then(countries => {})
        .catch(error => console.log(error));
}

function saveToDB(data) {
    db.get("countries")
        .push(...data)
        .write();
    // update db count
    db.update("count", n => n + 1);
}

let countries = db.get("countries").value();

//server
const PORT = 8080;
app.use(express.static(path.join(__dirname, `build`)));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/countries", (req, res) => {
    res.json(countries)
});

app.listen(PORT, () => console.log(`app is running on port ${PORT}`));
