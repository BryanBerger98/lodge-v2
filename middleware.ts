import { authMiddleware } from './middlewares/auth.middleware';
import { csrfMiddleware } from './middlewares/csrf.middleware';
import { emailVerifiedMiddleware } from './middlewares/email-verified.middleware';
import { stackMiddlewares } from './middlewares/stack-middlewares';

const middlewares = [ csrfMiddleware, authMiddleware, emailVerifiedMiddleware ];

export default stackMiddlewares(middlewares);