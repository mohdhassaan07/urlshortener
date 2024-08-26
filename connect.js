const mongoose = require("mongoose");
async function connecttomongodb(url){
    return mongoose.connect(process.env.MONGO_URL);
}

module.exports = {
    connecttomongodb,
}
