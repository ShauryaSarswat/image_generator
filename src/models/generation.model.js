const mongoose = require("mongoose")
const generationSchema = new mongoose.Schema(
    {
        user:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        prompt:{
            type: String,
            required: true
        },
        imageUrl:{
            type: String,
            required: true
        }
    },
    {
        timestamps:true
    }
)

module.exports = mongoose.model("Generation", generationSchema)