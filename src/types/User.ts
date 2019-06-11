import { Document, Model } from 'mongoose'

export interface IUser {
  profileId: string,
  displayName: string,
  email: string,
  profileUrl: string,
  isAdmin?: boolean,
  createdAt?: Date,
  updatedAt?: Date
}

export interface UserDocument extends Document, IUser {}

export interface UserModel extends Model<UserDocument> {
  createUser(user: IUser): Promise<UserDocument>
  findUserById(id: string): Promise<UserDocument | null>
  findUserByProfileId(profileId: string): Promise<UserDocument | null>
}
