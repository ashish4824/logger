import { Express, Request, Response } from 'express';
import mongooseUsersRouter from '../controllers/mongoose/user.controller';
import responseInterceptor from '../shared/middlewares/response-interceptor';
import { exceptionHandler } from '../shared/middlewares/exception-handling.middleware';
import { pageNotFoundExceptionHandler } from '../shared/middlewares/page-not-found-exception-handler.middleware';
const routerSetup = (app: Express) =>
  app
    .get('/', async (req: Request, res: Response) => {
      res.send('Hello Express APIvantage!');
    })
    .use(responseInterceptor)
    .use('/api/mongoose/users', mongooseUsersRouter)
    .use('*', pageNotFoundExceptionHandler)
    .use(exceptionHandler);

export default routerSetup;
