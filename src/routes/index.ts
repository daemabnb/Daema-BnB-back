import { Router } from 'express'
import userRouter from './user/index'
import saleRouter from './sale/index'
import purchaseRouter from './purchase/index'
import shareRouter from './share/index'
import rentalRouter from './rental/index'

const router: Router = Router()

router.use('/user', userRouter)
  .use('/sale', saleRouter)
  .use('/purchase', purchaseRouter)
  .use('/share', shareRouter)
  .use('/rental', rentalRouter)

export default router
