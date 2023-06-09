const controller = require("../controller/comment");
const { verifyToken } = require("../utils/varifyToken");
const Router = require("express").Router();

Router.post("/addcomment", verifyToken, controller.addcomment);
Router.put("/addcommentReply/:commentId", verifyToken, controller.addcommentReply);
Router.get("/getcomment", verifyToken, controller.getcomment);
Router.delete("/deletecomments/:commentId", verifyToken, controller.deletecomment);
Router.put("/updatecomments/:commentId", verifyToken, controller.updatecomment);

module.exports = Router;