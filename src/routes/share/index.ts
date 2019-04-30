import { Router } from 'express'
import * as ctrl from './ctrl'
import { verifyToken } from '../../util/jwt'

const shareRouter: Router = Router()

export default shareRouter
