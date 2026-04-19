const bcrypt = require("bcryptjs");
const User = require("../models/User");

const createAdmin = async () => {
  try {
    const adminExists = await User.findOne({ email: "admin@gmail.com" });

    if (!adminExists) {
      const hashedPassword = await bcrypt.hash("123456", 10);

      await User.create({
        email: "admin@gmail.com",
        password: hashedPassword,
        role: "admin",
      });

      console.log("✅ Admin user created");
    } else {
      console.log("ℹ️ Admin already exists");
    }
  } catch (error) {
    console.log("❌ Error creating admin:", error.message);
  }
};

module.exports = createAdmin;