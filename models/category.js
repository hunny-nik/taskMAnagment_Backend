const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
    category_title: {
        type: String,
        required: true,
    },
},
    {
        timestamps: true
    })
module.exports = mongoose.model("Category", categorySchema)