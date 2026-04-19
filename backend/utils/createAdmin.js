const bcrypt = require("bcryptjs");
const User = require("../models/User");

const createAdmin = async () => {
  try {
    const adminEmail = (process.env.ADMIN_EMAIL || "grkaluminiumshop@gmail.com").trim().toLowerCase();
    const adminPassword = process.env.ADMIN_PASSWORD || "gadd_1980";

    if (!adminEmail || !adminPassword) {
      // eslint-disable-next-line no-console
      console.warn("Admin seed skipped: ADMIN_EMAIL or ADMIN_PASSWORD is missing");
      return;
    }

    const adminUser = await User.findOne({ role: "admin" });

    if (!adminUser) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      await User.create({
        email: adminEmail,
        password: hashedPassword,
        role: "admin",
      });

      // eslint-disable-next-line no-console
      console.log("Admin created");
    } else {
      const shouldUpdateEmail = adminUser.email !== adminEmail;
      const passwordMatches = await bcrypt.compare(adminPassword, adminUser.password);

      if (shouldUpdateEmail || !passwordMatches) {
        adminUser.email = adminEmail;
        adminUser.password = await bcrypt.hash(adminPassword, 10);
        await adminUser.save();

        // eslint-disable-next-line no-console
        console.log("Admin updated from environment settings");
      }

      if (!shouldUpdateEmail && passwordMatches) {
        // eslint-disable-next-line no-console
        console.log("Admin already in sync");
      }
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error in admin seed:", error.message);
  }
};

module.exports = createAdmin;