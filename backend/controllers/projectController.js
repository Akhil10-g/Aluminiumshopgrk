const Project = require("../models/Project");

const buildProjectLabel = (description, fallbackPrefix) => {
  const text = String(description || '').trim();

  if (!text) {
    return fallbackPrefix;
  }

  const compact = text.replace(/\s+/g, ' ');
  return compact.length > 48 ? `${compact.slice(0, 48)}...` : compact;
};

const addProject = async (req, res) => {
  try {
    const { title, company, description } = req.body;
    const normalizedDescription = String(description || '').trim();

    const images = (req.files || []).map((file) => `/uploads/${file.filename}`);

    if (images.length === 0) {
      return res.status(400).json({ message: "At least one project image is required" });
    }

    const nextCount = (await Project.countDocuments()) + 1;
    const normalizedTitle =
      String(title || '').trim() || buildProjectLabel(normalizedDescription, `Project ${nextCount}`);
    const normalizedCompany = String(company || '').trim() || 'GRK Aluminium Works';

    const project = await Project.create({
      title: normalizedTitle,
      company: normalizedCompany,
      description: normalizedDescription,
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
    const { title, company, description, retainedImages } = req.body;

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const nextDescription = description !== undefined ? String(description || '').trim() : project.description;

    if (title !== undefined) {
      project.title = String(title || '').trim() || buildProjectLabel(nextDescription, project.title);
    }

    if (company !== undefined) {
      project.company = String(company || '').trim() || 'GRK Aluminium Works';
    }

    if (description !== undefined) {
      project.description = nextDescription;

      if (!title && !String(project.title || '').trim()) {
        project.title = buildProjectLabel(nextDescription, project.title || 'Project');
      }
    }

    const uploadedImages = (req.files || []).map((file) => `/uploads/${file.filename}`);

    if (retainedImages !== undefined) {
      let parsedRetained = [];

      try {
        if (Array.isArray(retainedImages)) {
          parsedRetained = retainedImages;
        } else {
          parsedRetained = JSON.parse(String(retainedImages || '[]'));
        }
      } catch (_error) {
        return res.status(400).json({ message: "Invalid retainedImages payload" });
      }

      const currentImagesSet = new Set(project.images || []);
      const safeRetained = parsedRetained
        .filter((image) => typeof image === 'string')
        .filter((image) => currentImagesSet.has(image));

      const nextImages = [...safeRetained, ...uploadedImages];

      if (nextImages.length === 0) {
        return res.status(400).json({ message: "At least one project image is required" });
      }

      project.images = nextImages;
    } else if (uploadedImages.length > 0) {
      project.images = uploadedImages;
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
