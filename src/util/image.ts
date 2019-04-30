import Err from './error'
import DB from '../model/index'

const db: DB = new DB()

const getImageNames = (images: string[]): Promise<string[]> => {
  return Promise.all(images.map(async (image) => {
    if (image.includes('.')) {
      const imageName = await saveImage([image])
      return imageName[0]
    }

    const oldImage = await db.findImageById(image)

    if (oldImage === null) {
      throw new Err('없는 이미지. 저리 가!', 405)
    }

    return image.concat(oldImage.extension)
  }))
}

const getImageLinks = (images: string[], changedImages: string[]): string[] => {
  return images.map((image, index) => {
    if (image.includes('.')) {
      return index
    }
    return 0
  }).filter(v => v !== 0 ? true : false).map(index => changedImages[index])
}

const saveImage = (images: string[]): Promise<string[]> => {
  return Promise.all(images.map(image => {
    const lastDot = image.lastIndexOf('.')

    if (lastDot === -1) {
      throw new Err('이상한 파일이 왔네? 저리 가!', 405)
    }

    return image.substring(lastDot, image.length)
  }).map(async (extension) => {
    const image = await db.createImage({ extension })
    return (image._id).concat(extension)
  }))
}

export { saveImage, getImageNames, getImageLinks}
