import { Router } from 'express'
import * as ctrl from './ctrl'
import { verifyToken } from '../../util/jwt'

const purchaseRouter: Router = Router()

purchaseRouter.get('/', verifyToken, ctrl.getPurchase)
  .get('/:id', verifyToken, ctrl.verifyPurchase, ctrl.getDetailPurchase)
  .post('/:id', verifyToken, ctrl.verifyPurchase, ctrl.postPurchase)
  .get('/history', verifyToken, ctrl.getPurchaseHistory)
  .get('/exchage/:id', verifyToken, ctrl.verifyPurchase, ctrl.getExchageAuthNum)
  .post('/exchage/:id', verifyToken, ctrl.verifyPurchase, ctrl.postExchageAuthNum)

export default purchaseRouter
