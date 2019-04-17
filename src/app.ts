import * as express from 'express'
const app: express.Application = express()

app.get('/', (req: express.Request, res: express.Response) => {
  res.send('hello world!').end()
})

export default app
