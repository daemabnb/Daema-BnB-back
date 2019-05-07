import { Router } from 'express'
import * as ctrl from './ctrl'
import { verifyToken } from '../../util/jwt'

const rentalRouter: Router = Router()

rentalRouter.get('/', verifyToken, ctrl.getRental)
  .get('/:id', verifyToken, ctrl.verifyRental, ctrl.getDetailRental)

export default rentalRouter
