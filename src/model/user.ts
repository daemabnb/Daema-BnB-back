import * as mongoose from 'mongoose'

const UserSchema: mongoose.Schema = new mongoose.Schema({
  id: {
    type: String,
    unique: true,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  userLink: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  updatedAt: {
    type: Date,
    default: Date.now()
  }
})

const User = mongoose.model('User', UserSchema)

export { User }
