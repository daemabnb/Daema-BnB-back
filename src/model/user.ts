import { Schema, Model, model } from 'mongoose'
import { IUser, UserDocument, UserModel } from '../types/User'

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

UserSchema.statics.createUser = (user: IUser): Promise<UserDocument> => {
  return new User(user).save()
}

UserSchema.statics.findUserById = (userId: string): Promise<UserDocument | null> => {
  return User.findById(userId).exec()
}

UserSchema.statics.findUserByProfileId = (profileId: string): Promise<UserDocument | null> => {
  return User.findOne({ profileId }).exec()
}

export const User: UserModel = model<UserDocument, UserModel>('User', UserSchema)
