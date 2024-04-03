const express = require("express");

const { scrapeLogic } = require("./scrapeLogic");
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

const PORT = process.env.PORT || 4000;

app.post("/scrape", (req, res) =>{
    console.log(req.body);
    scrapeLogic(req,res);
});

app.listen(PORT, () =>{
    console.log(`Listening on port ${PORT}`);
})
