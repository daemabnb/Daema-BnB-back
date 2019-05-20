import * as AWS from 'aws-sdk'
import { Types } from 'mongoose'
import { accessKey, secretAccessKey } from '../config'

interface SignedUrlParams {
  Key: string
  Bucket: string
  Expires: number
}

enum ImageType {
  Sale = 'sale',
  Share = 'share'
}

const s3: AWS.S3 = new AWS.S3()

const region = 'ap-northeast-2'
const bucketName = 'daemabnb-image'

AWS.config.update({
  accessKeyId: accessKey,
  secretAccessKey: secretAccessKey,
  region
})

const getParams = (key: string, bucket: string = bucketName, expires: number = 60): SignedUrlParams => {
  return {
    Key: key,
    Bucket: bucket,
    Expires: expires
  }
}

const getUploadUrl = (imageType: ImageType, id: Types.ObjectId, images: string[]): string[] => {
  return images.map(image => {
    const filePath = `${imageType}/${id}/${image}`
    return s3.getSignedUrl('putObject', getParams(filePath))
  })
}

const getDownloadUrl = (imageType: ImageType, id: Types.ObjectId, images: string[]): string[] => {
  return images.map(image => {
    const filePath = `${imageType}/${id}/${image}`
    return s3.getSignedUrl('getObject', getParams(filePath))
  })
}

export { getUploadUrl, getDownloadUrl, ImageType }
