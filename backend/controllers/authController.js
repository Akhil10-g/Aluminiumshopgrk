const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Admin = require("../models/Admin");

const seedDefaultAdmin = async () => {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    return;
  }

  const existingAdmin = await User.findOne({ email: email.toLowerCase(), role: "admin" });
  if (existingAdmin) {
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await User.create({
    email: email.toLowerCase(),
    password: hashedPassword,
    role: "admin",
  });

  // eslint-disable-next-line no-console
  console.log("Default admin account created");
};

const normalizeEmail = (value) => String(value || "").trim().toLowerCase();

const isPasswordMatch = async (rawPassword, storedPassword) => {
  const normalizedRaw = String(rawPassword || "");
  const normalizedStored = String(storedPassword || "");

  if (!normalizedRaw || !normalizedStored) {
    return false;
  }

  // Keep backward compatibility with legacy records that may store plain passwords.
  if (normalizedRaw === normalizedStored) {
    return true;
  }

  return bcrypt.compare(normalizedRaw, normalizedStored);
};

const adminLogin = async (req, res) => {
  try {
    const email = normalizeEmail(req.body?.email);
    const password = String(req.body?.password || "");

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const normalizedEmail = email;
    const envAdminEmail = normalizeEmail(process.env.ADMIN_EMAIL || "grkaluminiumshop@gmail.com");
    const envAdminPassword = String(process.env.ADMIN_PASSWORD || "gadd_1980");

    let admin = await User.findOne({ email: normalizedEmail, role: "admin" });

    // Backward compatibility for older records stored in Admin collection.
    if (!admin) {
      admin = await Admin.findOne({ email: normalizedEmail });
    }

    if (!admin) {
      // Allow emergency/env-based admin login when DB admin is missing or out of sync.
      if (normalizedEmail === envAdminEmail && password === envAdminPassword) {
        const token = jwt.sign(
          {
            id: "env-admin",
            email: envAdminEmail,
            role: "admin",
          },
          process.env.JWT_SECRET,
          { expiresIn: "1d" }
        );

        return res.status(200).json({
          message: "Login successful",
          token,
          admin: {
            id: "env-admin",
            email: envAdminEmail,
          },
        });
      }

      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await isPasswordMatch(password, admin.password);

    if (!isMatch) {
      if (normalizedEmail === envAdminEmail && password === envAdminPassword) {
        const token = jwt.sign(
          {
            id: admin._id,
            email: admin.email,
            role: "admin",
          },
          process.env.JWT_SECRET,
          { expiresIn: "1d" }
        );

        return res.status(200).json({
          message: "Login successful",
          token,
          admin: {
            id: admin._id,
            email: admin.email,
          },
        });
      }

      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        id: admin._id,
        email: admin.email,
        role: "admin",
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      admin: {
        id: admin._id,
        email: admin.email,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Login failed" });
  }
};

module.exports = {
  adminLogin,
  seedDefaultAdmin,
};
