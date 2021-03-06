import { Router } from 'express'
import * as ctrl from './ctrl'
import { verifyToken } from '../../util/jwt'

const rentalRouter: Router = Router()

rentalRouter.get('/', verifyToken, ctrl.getRental)
  .get('/:id', verifyToken, ctrl.verifyRental, ctrl.getDetailRental)
  .post('/:id', verifyToken, ctrl.verifyRental, ctrl.postRental)
  .get('/history', verifyToken, ctrl.getRentalHistory)
  .get('/exchange/:id', verifyToken, ctrl.verifyRental, ctrl.getExchangeAuthNum)
  .post('/exchange/:id', verifyToken, ctrl.verifyRental, ctrl.postExchangeAuthNum)
  .get('/return/:id', verifyToken, ctrl.verifyRental, ctrl.getReturnAuthNum)
  .post('/return/:id', verifyToken, ctrl.verifyRental, ctrl.postReturnAuthNum)

export default rentalRouter
