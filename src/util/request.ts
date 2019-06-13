import * as request from 'request'

export const getRequest = async (uri: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    request.get(uri, (err, res, data) => {
      if (err) {
        reject()
      }

      resolve(data)
    })
  })
}
