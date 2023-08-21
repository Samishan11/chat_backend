import { Schema, model, Document, ObjectId } from "mongoose";

export interface IChat extends Document {
  _id: ObjectId;
  requestBy: ObjectId;
  requestTo: ObjectId;
  isAccepted: boolean;
  date: string;
}

const FriendReuqestSchema = new Schema<IChat>(
  {
    requestBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    requestTo: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isAccepted: {
      type: Boolean,
      default: false,
    },
    date: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const FriendRequest = model<IChat>("FriendRequest", FriendReuqestSchema);
