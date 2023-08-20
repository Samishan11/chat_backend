import { Schema, model, Document, ObjectId } from "mongoose";

export interface IRoom extends Document {
  _id: ObjectId;
  users: ObjectId[]; // Specify the array type as ObjectId[]
  isGroup: boolean;
}

const roomSchema = new Schema<IRoom>(
  {
    users: [
      {
        type: Schema.Types.ObjectId,
        ref: "User", // Reference the "User" schema if applicable
        required: true,
      },
    ],
    isGroup: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const Room = model<IRoom>("Room", roomSchema);
