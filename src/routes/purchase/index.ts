import { Router } from 'express'
import * as ctrl from './ctrl'
import { verifyToken } from '../../util/jwt'

const purchaseRouter: Router = Router()

purchaseRouter.get('/', verifyToken, ctrl.getPurchase)
  .get('/purchase/:id', verifyToken, ctrl.getPurchaseDetail)

export default purchaseRouter
