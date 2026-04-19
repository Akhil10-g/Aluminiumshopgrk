const bcrypt = require("bcryptjs");
const User = require("../models/User");

const createAdmin = async () => {
  try {
    const adminUser = await User.findOne({ role: "admin" });
    const adminEmail = "grkaluminiumshop@gmail.com";
    const adminPassword = "gadd_1980";
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    if (!adminUser) {
      await User.create({
        email: adminEmail,
        password: hashedPassword,
        role: "admin",
      });

      // eslint-disable-next-line no-console
      console.log("Admin created");
    } else {
      adminUser.email = adminEmail;
      adminUser.password = hashedPassword;
      await adminUser.save();

      // eslint-disable-next-line no-console
      console.log("Admin updated");
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error in admin seed:", error.message);
  }
};

module.exports = createAdmin;