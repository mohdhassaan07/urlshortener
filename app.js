require('dotenv').config();
const express = require("express");
const app = express();
const port = process.env.PORT || 8000;
const path = require("path")
const urlroute = require("./routes/url")
const url = require("./models/url")
const { connecttomongodb } = require("./connect");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine","ejs")
app.set('views', path.join(__dirname, 'views'));
connecttomongodb("mongodb://127.0.0.1:27017/shorturl")
    .then(console.log("mongodb connected"));

app.use("/url", urlroute);

app.get("/",async(req,res)=>{
    let urls = await url.find();
    res.render("index", {urls});
})

app.get("/:shortid", async (req, res) => {
    try {
        const shortId = req.params.shortid;
        const entry = await url.findOneAndUpdate(
            { shortId },
            { $push: { visitHistory: { timestamp: new Date() } } },
            { new: true }
        );

        if (entry) {
            res.redirect(entry.redirectURL);
        } else {
            res.status(404).send("URL not found");
        }
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
    }
});




app.listen(port, () => { console.log(`server started at port ${port}`) })