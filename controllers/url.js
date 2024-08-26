const generateShortId = require('ssid');
const shortid = generateShortId();
const url = require("../models/url");
async function handleGenerateNewShortUrl(req,res){
    const shortId = shortid
    const body = req.body;
    if(!body.url) return res.status(400).json({error : "url is required"});
    await url.create({
        shortId : shortId,
        redirectURL : body.url,
        visitHistory: []
    })
    res.redirect(`/`);
}

async function handleGetAnalytics(req,res){
    const shortId = req.params.shortid;
    try {
        const result =  await url.findOne({shortid : shortId});
        const totalclicks = result.visitHistory.length;
        return res.json({
            totalclicks : totalclicks,
            analytics : result.visitHistory
        })
    } catch (error) {
        res.send(error);
    }
}

module.exports = {
    handleGenerateNewShortUrl,
    handleGetAnalytics
}