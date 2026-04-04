import mongoose from "mongoose";
import z from "zod";

import { UserType } from "../../modules/users/user.types.js";
import { hashPassword } from "../../utilities/utilis/hash.js";

const addressSchema = new mongoose.Schema(
  {
    full_name: { type: String, required: true },
    phone: { type: String, required: true },

    country: { type: String, default: "Egypt" },
    city: { type: String, required: true },
    area: { type: String, required: true },

    address_line_1: { type: String, required: true },
    address_line_2: { type: String },

    building_number: { type: String },
    floor: { type: String },
    apartment: { type: String },

    postal_code: { type: String },

    notes: { type: String },

    is_default: { type: Boolean, default: false },
  },
  { _id: true }, // each address gets its own id
);

const userSchema = new mongoose.Schema<UserType>(
  {
    activationToken: { select: false, type: String },
    birthDate: {
      type: Date,
    },
    email: {
      required: [true, "MISSING_PARAMETER_EMAIL"],
      type: String,
      unique: true,
      validate: {
        message: "INVALID_PARAMETER_EMAIL",
        validator: (value: string) =>
          z.email().toLowerCase().trim().safeParse(value).success,
      },
    },
    gender: {
      enum: ["MALE", "FEMALE"],
      type: String,
    },
    imageUrl: String,
    name: {
      required: [true, "MISSING_PARAMETER_NAME"],
      type: String,
    },
    password: {
      required: [true, "MISSING_PARAMETER_PASSWORD"],
      select: false,
      type: String,
      validate: {
        message: "INVALID_PARAMETER_PASSWORD",
        validator: (value: string) =>
          z.string().min(8).safeParse(value).success,
      },
    },
    phone: String,
    provider: {
      default: "LOCAL",
      enum: ["GOOGLE", "FACEBOOK", "LOCAL"],
      type: String,
      select: false,
    },
    status: {
      default: "INACTIVE",
      enum: ["ACTIVE", "INACTIVE"],
      type: String,
    },
    lastlogin: {
      type: Date,
      default: null,
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
    passwordChangedAt: Date,
    isAdmin: {
      default: false,
      type: Boolean,
      select: false,
    },
    addresses: {
      type: [addressSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre("save", async function () {
  if (!this.isModified("password") || this.isNew) {
    return;
  }
  this.passwordChangedAt = new Date(Date.now() - 1000);
});

userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  } else {
    this.password = await hashPassword(this.password);
  }
});

const UserModel = mongoose.model("User", userSchema);

export default UserModel;
