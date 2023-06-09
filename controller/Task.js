const { APP_host } = require("../middleware/dataconfig");
const Task = require("../models/Task")
const Subtask = require("../models/Subtask")
const Project = require("../models/projects")

module.exports = {

    /////////// add projects ///////////////
    async addTask(req, res, next) {
        try {
            const { status, description, title, priority, category, Due_date } = req.body;
            /////////////////////////////////////
            project_id = req.params.projectId
            const project = await Project.findById(project_id);
            if (!project) {
                return res.status(404).json({
                    success: false,
                    message: "no project found",
                    status: 404,
                });
            }
            ///////////////////////////////////////
            let files = []
            if (req.files) {
                files = req.files.map(file => ({
                    filename: file.originalname,
                    path: `${APP_host}profile/${file.mimetype.startsWith('image') ? 'images' : 'files'}/${file.filename}`,
                    type: file.mimetype.split('/')[0],
                }));
            }
            // const newtask = 
            let task = await new Task({
                status,
                description,
                title,
                priority,
                files,
                Due_date,
                category,
                user_id: req.user.id,
                project_id: req.params.projectId
            })
            await task.save()
            try {
                await Project.findByIdAndUpdate(
                    req.params.projectId,
                    { $push: { task_id: task._id } }
                )
            }
            catch (error) {
                next(error)
            }
            return res.status(200).send({
                success: true,
                message: "Task Added",
                status: 200,
                data: task,
            })
        }
        catch (error) {
            next(error)
        }
    },

    //////////// get projects /////////////////
    async getTask(req, res, next) {
        const { status, userId, projectId } = req.query;

        // Create the query object based on the provided parameters
        const query = {};
        if (status) {
            query.status = status;
        }
        if (userId) {
            query.user_id = userId;
        }
        if (projectId) {
            query.projectId = projectId;
        }
        try {
            const task = await Task.find(query)
                .populate("Comments")
                .populate("user_id", "_id name image")
                .populate("project_id", "_id title description")
                .populate("category")
                .sort({ date: -1 });



            return res.status(200).send({
                success: true,
                message: "Tasks",
                status: 200,
                data: task
            })
        } catch (error) {
            next(error)
        }
    },


    //////////// delete projects /////////////////
    async deleteTask(req, res, next) {
        try {
            const deletedTask = await Task.findByIdAndDelete(req.params.taskid);

            try {
                await Project.findByIdAndUpdate(deletedTask.project_id, { $pull: { task_id: req.params.taskid } });
            } catch (error) {
                // Handle error updating the project
                return res.status(500).send({
                    success: false,
                    message: "Error updating the project",
                    status: 500,
                    error: error.message
                });
            }

            const deletedSubtasks = await Subtask.deleteMany({ Task_id: deletedTask._id });

            return res.status(200).send({
                success: true,
                message: "Task deleted",
                status: 200,
                data: { deletedTask }
            });
        } catch (error) {
            // Handle error deleting the task
            next(error);
        }
    },


    //////////// update projects /////////////////
    async updateTask(req, res, next) {
        try {
            const updateTask = await Task.findByIdAndUpdate(
                req.params.taskid,
                { $set: req.body },
                { new: true }
            )

            return res.status(200).send({
                success: true,
                message: "Task updated",
                status: 200,
                data: updateTask
            })
        }
        catch (error) {
            next(error)
        }
    },
    //////////// update Task status /////////////////
    async updateTaskStatus(req, res, next) {
        const id = req.params.taskid
        const status = req.body.status
        try {
            const updateTask = await Task.findByIdAndUpdate(
                id,
                { status: req.body.status },
                { new: true }
            )
            return res.status(200).send({
                success: true,
                message: "project updated",
                status: 200,
                data: updateTask
            })

        } catch (error) {
            next(error)
        }
    }
}