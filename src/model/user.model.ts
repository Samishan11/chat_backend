import { Schema, model, Document, ObjectId } from "mongoose";
import bcrypt from "bcrypt";

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
  }
  { timestamps: true }
);


UserSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

UserSchema.pre("save", async function (next) {
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

export const User = model<IUser>("User", UserSchema);
