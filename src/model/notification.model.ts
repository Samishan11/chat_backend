import { Schema, model, Document, ObjectId } from "mongoose";

export interface IChat extends Document {
  _id: ObjectId;
  notificationBy: ObjectId;
  notificationTo: ObjectId;
  notification: string;
  isSeen: boolean;
  date: Date;
}

const NotificationSchema = new Schema<IChat>(
  {
    notificationBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    notificationTo: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    notification: {
      type: String,
      required: true,
    },
    isSeen: {
      type: Boolean,
      default: false,
    },
    date: {
      type: Date,
      default: new Date(),
    },
  },
  { timestamps: true }
);

export const Notification = model<IChat>("Notification", NotificationSchema);
