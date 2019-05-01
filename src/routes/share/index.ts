import { Router } from 'express'
import * as ctrl from './ctrl'
import { verifyToken } from '../../util/jwt'

const shareRouter: Router = Router()

shareRouter.post('/', verifyToken, ctrl.postShare)
  .get('/:id', verifyToken, ctrl.verifyShare, ctrl.getDetailShare)
  .put('/:id', verifyToken, ctrl.verifyShare, ctrl.putShare)
  .delete('/:id', verifyToken, ctrl.verifyShare, ctrl.deleteShare)

export default shareRouter
