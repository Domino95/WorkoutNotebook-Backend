const mongoose = require('mongoose')
const Float = require('mongoose-float').loadType(mongoose);
const Schema = mongoose.Schema

const trainingSchema = new Schema({
    createdAt: {
        type: Date,
        required: true
    },
    updatedAt: {
        type: Date,
        required: true
    },
    creator: {
        type: Schema.Types.ObjectId,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    exercises: [{
        name: {
            type: String,
            required: true
        },
        series: [{
            weight: {
                type: Float,
                require: true
            },
            reps: {
                type: Number,
                require: true
            }
        }]
    }],
})

module.exports = mongoose.model("Training", trainingSchema)