import { Router } from 'express'
import * as ctrl from './ctrl'
import { verifyToken } from '../../util/jwt'

const saleRouter: Router = Router()

saleRouter.post('/', verifyToken, ctrl.postSale)
  .get('/:id', verifyToken, ctrl.verifySale, ctrl.getDetailSale)
  .put('/:id', verifyToken, ctrl.verifySale, ctrl.putSale)
  .delete('/:id', verifyToken, ctrl.verifySale, ctrl.deleteSale)

export default saleRouter
