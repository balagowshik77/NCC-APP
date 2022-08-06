const bcrypt = require("bcrypt");
const asyncHandler = require("express-async-handler");
const Ncc = require("../models/Ncc");

const registerNcc = asyncHandler(async (req, res) => {
  const { regId, name, email, phone, password } = req.body;

  if (!regId || !name || !email || phone || !password) {
    res.status(400);
    throw new Error("Please provide requied fields!");
  }

  const regIdExists = await Ncc.find({ regId });

  if (regIdExists) {
    res.status(400);
    throw new Error("User already exists!");
  }

  try {
    // Hashing password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new ncc
    const ncc = await Ncc.create({
      regId,
      name,
      email,
      password: hashedPassword,
      phone,
    });

    res.status(200).json({
      message: "Account successfully created",
      ncc: {
        _id: ncc.id,
        name: ncc.name,
        email: ncc.email,
        phone: ncc.phone,
        token: generateToken(ncc.id),
      },
    });
  } catch (err) {
    console.log(err);
    res.status(400);
    throw new Error(err.message);
  }
});

// Login a ncc
// Public
const loginNcc = async (req, res) => {
  const { regId, password } = req.body;

  // Validating input data
  if (!regId || !password) {
    res.status(400);
    throw new Error("Please provide requied fields!");
  }

  // Search for the ncc
  const foundedNcc = await User.findOne({ regId });
  if (!foundedNcc) {
    res.status(400);
    throw new Error("User not found!");
  }

  try {
    const isVaildPassword = await bcrypt.compare(password, foundedNcc.password);

    if (!isVaildPassword) {
      res.status(400);
      throw new Error("Invaild credentials!");
    }

    res.status(200).json({
      message: "Successfully logged in",
      ncc: {
        _id: foundedNcc.id,
        name: foundedNcc.name,
        email: foundedNcc.email,
        phone: foundedNcc.phone,
        token: generateToken(foundedNcc.id),
      },
    });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};

// Get a ncc with an id
// Public
const getNcc = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    res.status(400);
    throw new Error("Please provide the id");
  }

  try {
    const ncc = await Ncc.findById(id);
    res.status(200).json({
      message: "Success",
      ncc: {
        _id: ncc.id,
        name: ncc.name,
        email: ncc.email,
        phone: ncc.phone,
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
  registerNcc,
  loginNcc
};
