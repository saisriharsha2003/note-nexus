import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  message: String,
  noteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Note'
  },
  noteTitle: { type: String, required: false },
  createdBy: String,
  recipients: [String],
  seenBy: [String],
}, { timestamps: true });

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
