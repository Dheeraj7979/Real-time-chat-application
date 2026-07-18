import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt'

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
    },

    googleId: {
      type: String,
      unique: true,
      sparse: true,
      default: null,
    },

    name: {
      type: String,
      default: "",
    },

    phone: {
      type: String,
      default: "",
    },

    about: {
      type: String,
      default: "",
    },

    accessToken: {
      type: String,
    },

    refreshToken: {
      type: String,
    },

    profile: {
      type: String,
      default: "",
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    friends: [
      {
        type: String,
      },
    ],

    requests: [
      {
        type: String,
      },
    ],

    rooms: [
      {
        id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Room",
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRESIN,
    }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRESIN,
    }
  );
};

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }

    if (!this.password) {
        return next();
    }

    this.password = await bcrypt.hash(this.password, 10);

});

export const User = mongoose.model("User", userSchema);