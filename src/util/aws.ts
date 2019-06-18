import * as AWS from 'aws-sdk'
import { Types } from 'mongoose'
import { accessKey, secretAccessKey } from '../config'

interface SignedUrlParams {
  Key: string
  Bucket: string
  Expires: number
}

export enum ImageType {
  Sale = 'sale',
  Share = 'share'
}

const region = 'ap-northeast-2'
const bucketName = 'daemabnb-image'

AWS.config.update({
  accessKeyId: accessKey,
  secretAccessKey: secretAccessKey,
  region,
  signatureVersion: 'v4'
})

const s3: AWS.S3 = new AWS.S3({
  accessKeyId: accessKey,
  secretAccessKey: secretAccessKey,
  region: 'ap-northeast-2',
  signatureVersion: 'v4'
})

const getParams = (key: string, bucket: string = bucketName, expires: number = 60): SignedUrlParams => {
  return {
    Key: key,
    Bucket: bucket,
    Expires: expires
  }
}

export const getUploadUrl = (imageType: ImageType, id: string, images: string[]): string[] => {
  return images.map(image => {
    const filePath = `${imageType}/${id}/${image}`
    return s3.getSignedUrl('putObject', getParams(filePath))
  })
}

export const getDownloadUrl = (imageType: ImageType, id: string, images: string[]): string[] => {
  return images.map(image => {
    const filePath = `${imageType}/${id}/${image}`
    return s3.getSignedUrl('getObject', getParams(filePath))
  })
}
