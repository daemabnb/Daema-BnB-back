import { Router } from 'express'
import * as ctrl from './ctrl'
import { verifyToken } from '../../util/jwt'

const rentalRouter: Router = Router()

rentalRouter.get('/', verifyToken, ctrl.getRental)

export default rentalRouter
