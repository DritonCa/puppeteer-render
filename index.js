const express = require("express");

const { scrapeLogic } = require("./scrapeLogic");
const app = express();

const PORT = process.env.PORT || 4000;

app.get("/scrape", (req, res) =>{
    scrapeLogic(res);
});

app.post("/scrape", (req, res) =>{
    scrapeLogic(req,res);
});

app.listen(PORT, () =>{
    console.log(`Listening on port ${PORT}`);
})
