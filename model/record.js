const { model, Schema } = require('mongoose');

const DOCUMENT_NAME = 'records';

const RecordSchema = new Schema({
  sessionId: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  feeling: {
    type: String,
  },
  dayOfWalk: {
    type: String,
  },
  timeSlots: {
    type: Schema.Types.Array,
  },
  hobbies: {
    type: Schema.Types.Array,
  },
  numInput: {
    type: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
    default: Date.now(),
  },
});

// export model record with RecordSchema
const RecordModel = model(DOCUMENT_NAME, RecordSchema);
module.exports = RecordModel;
