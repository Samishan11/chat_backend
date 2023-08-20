import { Schema, model, Document, ObjectId } from "mongoose";
import bcrypt from "bcrypt";
import { NextFunction } from "express";

export interface IUser extends Document {
  _id: ObjectId;
  fullname: string;
  username: string;
  email: string;
  password: string;
  image?: string;
  matchPassword(password: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    fullname: { type: String, require: true },
    username: { type: String, require: true },
    email: {
      type: String,
      require: true,
      unique: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email address",
      ],
    },
    password: { type: String, require: true },
  },
  { timestamps: true }
);

UserSchema.methods.matchPassword = async function (
  password: string
): Promise<boolean> {
  return await bcrypt.compare(password, this.password);
};

UserSchema.pre<IUser>("save", async function (next: any) {
  if (!this.isModified("password")) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

// UserSchema.pre("save", async function (next: any) {
//   const user = this;

//   if (!user.isModified("password")) next();

//   bcrypt.genSalt(10, (err: any, salt: string) => {
//     if (err) return next(err);
//     bcrypt.hash(user.password, salt, (err: any, hash: string) => {
//       if (err) return next(err);
//       user.password = hash;
//       next();
//     });
//   });
// });

export const User = model<IUser>("User", UserSchema);
