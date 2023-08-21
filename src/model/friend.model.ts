import { Schema, model, Document, ObjectId } from "mongoose";

export interface IChat extends Document {
  _id: ObjectId;
  aurthor: ObjectId;
  friend: ObjectId;
  date: string;
  roomId: ObjectId;
}

const FriendModel = new Schema<IChat>(
  {
    aurthor: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    friend: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    roomId: {
      type: Schema.Types.ObjectId,
      ref: "Room",
    },
    date: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const Friend = model<IChat>("Friend", FriendModel);
