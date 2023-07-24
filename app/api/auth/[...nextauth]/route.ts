/* eslint-disable require-await */
import NextAuth from 'next-auth';

import authOptions from '@/utils/auth/auth-options';

const authHandler = NextAuth(authOptions);

export { authHandler as GET, authHandler as POST };