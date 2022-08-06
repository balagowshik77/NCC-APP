const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User");

// Get a user with an id
// Public
const getUser = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    res.status(400);
    throw new Error("Please provide the id");
  }

  try {
    const user = await User.findById(id);
    res.status(200).json({ message: "Success", user });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};

// Get all users
// Private
const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json({ message: "Success", users });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};

// Delete all users
// Private
// const deleteUsers = async (req, res) => {
//   try {
//     await User.deleteMany({});
//     res.status(200).json({ message: "Successfully deleted all users!" });
//   } catch (error) {
//     res.status(400);
//     throw new Error(error.message);
//   }
// };

// Delete a user with an id
// Public
const deleteUser = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    res.status(400);
    throw new Error("Please provide the id");
  }

  try {
    const user = await User.findByIdAndRemove(id);
    res.status(200).json({ message: `Successfully user ${user.name}` });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};

// Update a user with an id
// Public
const updateUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  const { name } = req.body;

  if (!user) {
    res.status(400);
    throw new Error("User not found!");
  }

  try {
    await User.findByIdAndUpdate(req.params.id, { name }, { new: true });
    res.status(200).json({ message: "Successfully updated!" });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};

// Login a user
// Public
const login = async (req, res) => {
  const { email, password } = req.body;

  // Validating input data
  if (!email || !password) {
    res.status(400);
    throw new Error("Please provide requied fields!");
  }

  // Search for the user
  const foundedUser = await User.findOne({ email });
  if (!foundedUser) {
    res.status(400);
    throw new Error("User not found!");
  }

  try {
    const isVaildPassword = await bcrypt.compare(
      password,
      foundedUser.password
    );

    if (!isVaildPassword) {
      res.status(400);
      throw new Error("Invaild credentials!");
    }

    res
      .status(200)
      .json({ message: "Successfully logged in", user: {
        _id: foundedUser.id,
        name: foundedUser.name,
        email: foundedUser.email,
        phone: foundedUser.phone,
        token: generateToken(foundedUser.id)
      } });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};

// Register a user
// Public
const register = async (req, res) => {
  const { name, email, password, phone } = req.body;

  // Validating input data
  if (!name || !email || !password || !phone) {
    res.status(400);
    throw new Error("Please provide requied fields!");
  }

  // Check if user exists
  const userExists = await User.findOne({ email });
  const phoneExists = await User.findOne({ phone });

  if (userExists || phoneExists) {
    res.status(400);
    throw new Error("User already exists!");
  }

  try {
    // Hashing password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
    });

    res.status(200).json({
      message: "Account successfully created",
      user: {
        _id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        token: generateToken(user.id),
      },
    });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

module.exports = {
  getUser,
  getUsers,
  deleteUser,
  updateUser,
  login,
  register,
};
