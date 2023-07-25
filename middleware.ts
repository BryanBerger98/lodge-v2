import { authMiddleware } from './middlewares/auth.middleware';
import { csrfMiddleware } from './middlewares/csrf.middleware';
import { pathnameMiddleware } from './middlewares/pathname.middleware';
import { stackMiddlewares } from './middlewares/stack-middlewares';

const middlewares = [ pathnameMiddleware, csrfMiddleware, authMiddleware ];

export default stackMiddlewares(middlewares);