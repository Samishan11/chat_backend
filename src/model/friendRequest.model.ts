import { Schema, model, Document, ObjectId } from "mongoose";

export interface IChat extends Document {
  _id: ObjectId;
  requestBy: ObjectId;
  requestTo: ObjectId;
  isAccepted: boolean;
  date: string;
}

const ChatSchema = new Schema<IChat>(
  {
    requestBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true, // Specify that this field is required
    },
    requestTo: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true, // Specify that this field is required
    },
    isAccepted: {
      type: Boolean,
      default: false,
    },
    date: {
      type: String,
      required: true, // Specify that this field is required
    },
  },
  { timestamps: true }
);

export const Chat = model<IChat>("Chat", ChatSchema);
