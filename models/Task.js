const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    subtask_id: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subtask'
    }],
    Due_date: {
        type: String,
        required: true
    },
    project_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true,
    },
    type: {
        type: String,
        default: "Task"
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    priority: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['new', 'todo', 'pending', 'completed', 'pendingclientreview', 'pendingthirdpartyaction', 'revision', 'readyforreview'],
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
    },
    files: [
        {
            filename: {
                type: String
            },
            path: {
                type: String
            },
            type: {
                type: String
            }
        }
    ],
    created_at: {
        type: Date,
        default: Date.now()
    },
    Comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }],
})

module.exports = mongoose.model("Task", taskSchema)