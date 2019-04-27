import { Schema, Model, Document, model } from 'mongoose'

interface IUser {
  profileId: string,
  displayName: string,
  email: string,
  profileUrl: string,
  isAdmin?: boolean,
  createdAt?: Date,
  updatedAt?: Date
}

interface UserDocument extends Document, IUser {}

const UserSchema: Schema = new Schema({
  profileId: {
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
  profileUrl: {
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

const User: Model<UserDocument> = model<UserDocument>('User', UserSchema)

export { User, IUser, UserDocument }
