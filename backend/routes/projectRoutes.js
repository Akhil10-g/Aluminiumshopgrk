const express = require("express");
const {
  addProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
} = require("../controllers/projectController");
const upload = require("../middleware/upload");
const verifyToken = require("../middleware/verifyToken");

const router = express.Router();

router.post("/", verifyToken, upload.array("images"), addProject);
router.get("/", getProjects);
router.get("/:id", getProject);
router.put("/:id", verifyToken, upload.array("images"), updateProject);
router.delete("/:id", verifyToken, deleteProject);

module.exports = router;
