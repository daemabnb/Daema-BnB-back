import { Router } from 'express'
import * as ctrl from './ctrl'
import { verifyToken } from '../../util/jwt'

const saleRouter: Router = Router()

saleRouter.post('/', verifyToken, ctrl.postSale)
  .get('/:id', verifyToken, ctrl.getDetailSale)

export default saleRouter
