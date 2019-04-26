import * as AWS from 'aws-sdk'
import { Types } from 'mongoose'
import { config } from 'dotenv'

config()

interface SignedUrlParams {
  Key: string
  Bucket: string
  Expires: number
}

interface SaleImageFormat {
  fileName: string
  saleId: Types.ObjectId
}

const s3: AWS.S3 = new AWS.S3()

const accessKey = process.env.ACCESS_KEY as string
const secretAccessKey = process.env.SECRET_ACCESS_KEY as string

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

const getUploadUrl = (params: SaleImageFormat[]): string[] => {
  return params.map(param => {
    const filePath = `${param.saleId}/${param.fileName}`
    return s3.getSignedUrl('putObject', getParams(filePath))
  })
}

const getDownloadUrl = (params: SaleImageFormat[]): string[] => {
  return params.map(param => {
    const filePath = `${param.saleId}/${param.fileName}`
    return s3.getSignedUrl('getObject', getParams(filePath))
  })
}

export { getUploadUrl, getDownloadUrl, SaleImageFormat }
