import { Router } from 'express'
import * as ctrl from './ctrl'
import { verifyToken } from '../../util/jwt'

const purchaseRouter: Router = Router()

purchaseRouter.get('/', verifyToken, ctrl.getPurchase)
  .get('/:id', verifyToken, ctrl.verifyPurchase, ctrl.getDetailPurchase)

export default purchaseRouter
