import { authMiddleware } from './middlewares/auth.middleware';
import { csrfMiddleware } from './middlewares/csrf.middleware';
import { stackMiddlewares } from './middlewares/stack-middlewares';

const middlewares = [ csrfMiddleware, authMiddleware ];

export default stackMiddlewares(middlewares);