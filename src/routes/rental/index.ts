import { Router } from 'express'
import * as ctrl from './ctrl'
import { verifyToken } from '../../util/jwt'

const rentalRouter: Router = Router()

export default rentalRouter
