import { config } from 'dotenv'
import app from '../app'

config()

app.listen(3000, () => console.log('start'))
