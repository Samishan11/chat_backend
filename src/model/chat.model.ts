import { Schema, model, Document, ObjectId } from "mongoose";

export interface IChat extends Document {
  _id: ObjectId;
  messageBy: ObjectId;
  messageTo: ObjectId;
  message: string;
  date: string;
}

const ChatSchema = new Schema(
  {
    messageBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    messageTo: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    message: {
      type: String,
    },
    date: {
      type: String,
    },
    roomId: {
      type: Schema.Types.ObjectId,
      ref: "Room",
    },
  },
  { timestamps: true }
);

export const Chat = model("Chat", ChatSchema);
