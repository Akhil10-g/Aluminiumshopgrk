const Homepage = require('../models/Homepage');

const ensureHomepage = async () => {
  const existing = await Homepage.findOne();

  if (existing) {
    return existing;
  }

  return Homepage.create({
    hero: {
      founderImage: '',
      workImages: [],
    },
    services: [],
    materials: [],
  });
};

const parseJsonField = (value, fallback) => {
  if (!value) {
    return fallback;
  }

  try {
    return JSON.parse(value);
  } catch (error) {
    return fallback;
  }
};

const mapUploadedPath = (file, req) => `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;

const mergeServicesWithUploads = (items, files, req) => {
  let fileIndex = 0;

  return (items || [])
    .map((item) => {
      const normalizedTitle = String(item?.title || '').trim();
      const normalizedDescription = String(item?.description || '').trim();
      const incomingImages = Array.isArray(item?.images) ? item.images : [];

      if (!normalizedTitle) {
        return null;
      }

      const resolvedImages = incomingImages
        .map((imageRef) => {
          if (imageRef === '__NEW__') {
            const nextFile = files[fileIndex];
            fileIndex += 1;
            return nextFile ? mapUploadedPath(nextFile, req) : null;
          }

          return imageRef || null;
        })
        .filter(Boolean);

      return {
        title: normalizedTitle,
        description: normalizedDescription,
        image: resolvedImages[0] || '',
        images: resolvedImages,
      };
    })
    .filter(Boolean);
};

const mergeItemsWithUploads = (items, files, req) => {
  let fileIndex = 0;

  return (items || [])
    .map((item) => {
      const normalizedTitle = String(item?.title || '').trim();
      const incomingImage = item?.image;

      if (!normalizedTitle) {
        return null;
      }

      if (incomingImage === '__NEW__') {
        const nextFile = files[fileIndex];
        fileIndex += 1;

        if (!nextFile) {
          return null;
        }

        return {
          title: normalizedTitle,
          image: mapUploadedPath(nextFile, req),
        };
      }

      if (!incomingImage) {
        return null;
      }

      return {
        title: normalizedTitle,
        image: incomingImage,
      };
    })
    .filter(Boolean);
};

const getHomepage = async (req, res) => {
  try {
    const homepage = await ensureHomepage();
    return res.status(200).json(homepage);
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Failed to fetch homepage data' });
  }
};

const updateHomepage = async (req, res) => {
  try {
    const homepage = await ensureHomepage();

    const heroPayload = parseJsonField(req.body.hero, {});
    const servicesPayload = parseJsonField(req.body.services, null);
    const materialsPayload = parseJsonField(req.body.materials, null);

    const founderFile = req.files?.founderImage?.[0];
    const workImageFiles = req.files?.workImages || [];
    const serviceImageFiles = req.files?.serviceImages || [];
    const materialImageFiles = req.files?.materialImages || [];

    const heroWorkImages = Array.isArray(heroPayload.workImages)
      ? heroPayload.workImages.filter((item) => Boolean(item))
      : [];

    const uploadedWorkImages = workImageFiles.map((file) => mapUploadedPath(file, req));

    homepage.hero = {
      founderImage: founderFile
        ? mapUploadedPath(founderFile, req)
        : String(heroPayload.founderImage || homepage.hero?.founderImage || ''),
      workImages: [...heroWorkImages, ...uploadedWorkImages],
    };

    if (Array.isArray(servicesPayload)) {
      homepage.services = mergeServicesWithUploads(servicesPayload, serviceImageFiles, req);
    }

    if (Array.isArray(materialsPayload)) {
      homepage.materials = mergeItemsWithUploads(materialsPayload, materialImageFiles, req);
    }

    await homepage.save();

    return res.status(200).json({
      message: 'Homepage updated successfully',
      homepage,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Failed to update homepage data' });
  }
};

module.exports = {
  getHomepage,
  updateHomepage,
};
