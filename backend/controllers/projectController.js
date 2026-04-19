const Project = require("../models/Project");

const addProject = async (req, res) => {
  try {
    const { title, company, description } = req.body;
    const normalizedTitle = String(title || '').trim();
    const normalizedCompany = String(company || '').trim();
    const normalizedDescription = String(description || '').trim();

    if (!normalizedTitle || !normalizedCompany) {
      return res.status(400).json({ message: "title and company are required" });
    }

    const images = (req.files || []).map((file) => `/uploads/${file.filename}`);

    const project = await Project.create({
      title: normalizedTitle,
      company: normalizedCompany,
      description: normalizedDescription || 'Project images uploaded from admin gallery.',
      images,
    });

    return res.status(201).json({
      message: "Project created successfully",
      project,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Failed to create project" });
  }
};

const getProjects = async (req, res) => {
  try {
    const { company, page = 1, limit = 10, sort = "latest" } = req.query;

    const query = {};

    if (company) {
      query.company = { $regex: company, $options: "i" };
    }

    const parsedPage = Math.max(parseInt(page, 10) || 1, 1);
    const parsedLimit = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 100);
    const skip = (parsedPage - 1) * parsedLimit;

    const sortOption = sort === "oldest" ? { createdAt: 1 } : { createdAt: -1 };

    const [projects, total] = await Promise.all([
      Project.find(query).sort(sortOption).skip(skip).limit(parsedLimit),
      Project.countDocuments(query),
    ]);

    return res.status(200).json({
      total,
      page: parsedPage,
      limit: parsedLimit,
      totalPages: Math.ceil(total / parsedLimit),
      projects,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Failed to fetch projects" });
  }
};

const getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    return res.status(200).json(project);
  } catch (error) {
    return res.status(500).json({ message: error.message || "Failed to fetch project" });
  }
};

const updateProject = async (req, res) => {
  try {
    const { title, company, description } = req.body;

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (title !== undefined) project.title = title;
    if (company !== undefined) project.company = company;
    if (description !== undefined) project.description = description;

    if (req.files && req.files.length > 0) {
      project.images = req.files.map((file) => `/uploads/${file.filename}`);
    }

    const updatedProject = await project.save();

    return res.status(200).json({
      message: "Project updated successfully",
      project: updatedProject,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Failed to update project" });
  }
};

const deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    return res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Failed to delete project" });
  }
};

module.exports = {
  addProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
};
