const userModel = require("../models/userModel");
const clinicModel = require("../models/clinicsModel");
const ngoModel = require("../models/ngoModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const cloudinary = require("../uploads/cloudinary"); // Your cloudinary setup
require("dotenv").config();

const jwtToken = (id) => {
  return jwt.sign({ id }, process.env.VITE_JWT_SECRET, { expiresIn: "24h" });
};

// Helper function to upload image to Cloudinary
const uploadImageToCloudinary = async (
  imageBuffer,
  folder = "healthtech_pro"
) => {
  try {
    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: folder,
            resource_type: "image",
            quality: "auto",
            fetch_format: "auto",
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        )
        .end(imageBuffer);
    });
  } catch (error) {
    throw new Error("Image upload failed");
  }
};

//Storing user info to db via signup
const registerUser = async (req, res) => {
  try {
    console.log("Request body:", req.body);
    console.log("Request files:", req.files);

    const data = req.body || {};

    const {
      name,
      email,
      password,
      organizationType,
      // Clinic fields
      clinicName,
      clinicAddress,
      clinicPhone,
      clinicDescription,
      // NGO fields
      ngoName,
      ngoPhone,
      ngoAddress,
      ngoDescription,
      // User field
      personalPhone,
    } = data;

    if (!name || !email || !password || !organizationType) {
      return res.json({
        success: false,
        message: "Name, email, password, and organization type are required",
      });
    }

    const userExist = await userModel.findOne({ email });
    if (userExist) {
      return res.json({
        success: false,
        message: "User with email already exists",
      });
    }

    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "Please enter valid email format",
      });
    }

    if (password.length <= 8) {
      return res.json({
        success: false,
        message: "Please enter 8 digit strong password",
      });
    }

    const validOrgTypes = ["clinic", "ngo", "user"];
    if (!validOrgTypes.includes(organizationType)) {
      return res.json({
        success: false,
        message: "Invalid organization type",
      });
    }

    //Salting and hashing of password
    const salt = await bcrypt.genSalt(10);
    const hashing = await bcrypt.hash(password, salt);

    const userData = {
      name: name,
      email: email,
      password: hashing,
      organizationType: organizationType,
    };

    // Handle image uploads and conditional fields
    let imageUrl = null;

    if (organizationType === "clinic") {
      if (!clinicName || !clinicAddress || !clinicPhone || !clinicDescription) {
        return res.json({
          success: false,
          message: "All clinic fields are required",
        });
      }

      // Handle clinic image upload
      if (req.files && req.files.clinicImage) {
        console.log("Uploading clinic image...");
        const uploadResult = await uploadImageToCloudinary(
          req.files.clinicImage[0].buffer,
          "healthtech_pro/clinics"
        );
        imageUrl = uploadResult.secure_url;
        console.log("Clinic image uploaded:", imageUrl);
      } else {
        console.log("No clinic image provided");
      }

      // Validate phone number
      if (!validator.isMobilePhone(clinicPhone)) {
        return res.json({
          success: false,
          message: "Please enter a valid clinic phone number",
        });
      }

      userData.clinicDetails = {
        clinicName: clinicName,
        clinicAddress: clinicAddress,
        clinicPhone: clinicPhone,
        clinicDescription: clinicDescription,
        clinicImage: imageUrl,
      };
    } else if (organizationType === "ngo") {
      if (!ngoName || !ngoPhone || !ngoAddress || !ngoDescription) {
        return res.json({
          success: false,
          message: "All NGO fields are required",
        });
      }

      // Handle NGO image upload
      if (req.files && req.files.ngoImage) {
        console.log("Uploading NGO image...");
        const uploadResult = await uploadImageToCloudinary(
          req.files.ngoImage[0].buffer,
          "healthtech_pro/clinics"
        );
        imageUrl = uploadResult.secure_url;
        console.log("NGO image uploaded:", imageUrl);
      } else {
        console.log("No NGO image provided");
      }

      // Validate phone number
      if (!validator.isMobilePhone(ngoPhone)) {
        return res.json({
          success: false,
          message: "Please enter a valid NGO phone number",
        });
      }

      userData.ngoDetails = {
        ngoName: ngoName,
        ngoPhone: ngoPhone,
        ngoAddress: ngoAddress,
        ngoDescription: ngoDescription,
        ngoImage: imageUrl,
      };
    } else if (organizationType === "user") {
      // Validate required user fields
      if (!personalPhone) {
        return res.json({
          success: false,
          message: "Personal phone number is required",
        });
      }

      // Validate phone number
      if (!validator.isMobilePhone(personalPhone)) {
        return res.json({
          success: false,
          message: "Please enter a valid phone number",
        });
      }

      userData.personalPhone = personalPhone;
    }

    //Storing new user to db
    const newUser = new userModel(userData);
    const user = await newUser.save();

    // Save clinic or NGO to respective model
    if (organizationType === "clinic") {
      const newClinic = new clinicModel({
        userId: user._id,
        clinicName,
        clinicAddress,
        clinicPhone,
        clinicDescription,
        clinicImage: imageUrl,
      });
      await newClinic.save();
    } else if (organizationType === "ngo") {
      const newNgo = new ngoModel({
        userId: user._id,
        ngoName,
        ngoPhone,
        ngoAddress,
        ngoDescription,
        ngoImage: imageUrl,
      });
      await newNgo.save();
    }

    const token = jwtToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Strict",
      secure: process.env.VITE_NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
    });

    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      organizationType: user.organizationType,
      clinicMemberships: user.clinicMemberships,
    };

    // Add organization-specific details to response
    if (organizationType === "clinic" && user.clinicDetails) {
      userResponse.clinicDetails = user.clinicDetails;
    } else if (organizationType === "ngo" && user.ngoDetails) {
      userResponse.ngoDetails = user.ngoDetails;
    } else if (organizationType === "user" && user.personalPhone) {
      userResponse.personalPhone = user.personalPhone;
    }

    res.json({
      success: true,
      token,
      user: userResponse,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message || "Error while registering new user",
    });
  }
};

//Login user function
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User does not exist" });
    }

    const matchCredits = await bcrypt.compare(password, user.password);
    if (!matchCredits) {
      return res.status(401).json({
        success: false,
        message: "Either email or password invalid",
      });
    }

    const token = jwtToken(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
    });

    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      organizationType: user.organizationType,
      clinicMemberships: user.clinicMemberships,
    };

    if (user.organizationType === "clinic" && user.clinicDetails) {
      userResponse.clinicDetails = user.clinicDetails;
    } else if (user.organizationType === "ngo" && user.ngoDetails) {
      userResponse.ngoDetails = user.ngoDetails;
    } else if (user.organizationType === "user" && user.personalPhone) {
      userResponse.personalPhone = user.personalPhone;
    }

    return res.status(200).json({
      success: true,
      token,
      user: userResponse,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Error while logging user" });
  }
};

//Log out user function
const logoutUser = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Strict",
    secure: process.env.VITE_NODE_ENV === "production",
  });
  res.json({ success: true, message: "Logged out successfully" });
};

//Verifying user there or not
const verifyUser = async (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Not authenticated" });
  }

  try {
    const decoded = jwt.verify(token, process.env.VITE_JWT_SECRET);
    const user = await userModel.findById(decoded.id);
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "User not found" });
    }

    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      organizationType: user.organizationType,
      clinicMemberships: user.clinicMemberships,
    };

    if (user.organizationType === "clinic" && user.clinicDetails) {
      userResponse.clinicDetails = user.clinicDetails;
    } else if (user.organizationType === "ngo" && user.ngoDetails) {
      userResponse.ngoDetails = user.ngoDetails;
    } else if (user.organizationType === "user" && user.personalPhone) {
      userResponse.personalPhone = user.personalPhone;
    }

    res.status(200).json({ success: true, user: userResponse });
  } catch (error) {
    console.error("Verification Error:", error);
    res.status(401).json({ success: false, message: "Invalid token" });
  }
};

module.exports = { loginUser, registerUser, logoutUser, verifyUser };
