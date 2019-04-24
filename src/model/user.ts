import { Schema, Model, Document, model } from 'mongoose'

interface UserFormat extends Document {
  id: string,
  displayName: string,
  email: string,
  userLink: string,
  isAdmin: boolean,
  createdAt: Date,
  updatedAt: Date
}

const UserSchema: Schema = new Schema({
  id: {
    type: String,
    unique: true,
    required: true
  },
  displayName: {
    type: String,
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
  isAdmin: {
    type: Boolean,
    default: false
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

const User: Model<UserFormat> = model<UserFormat>('User', UserSchema)

export { User, UserFormat }
