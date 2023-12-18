import { NextRequest, NextResponse } from 'next/server';
import { Session } from 'next-auth';

import { connectToDatabase } from '@/lib/database';
import { Role } from '@/schemas/role.schema';
import { IUserPopulated } from '@/schemas/user/populated.schema';

import { setServerAuthGuard } from '../auth';

import { sendApiError } from './error';

type AuthGuardOption = boolean;

type ApiHandleContextBase = {
	params: { [key: string]: string };
	searchParams: { [k: string]: string };
};

type ApiHandlerContextWithAuthGuard = ApiHandleContextBase & {
	currentUser: IUserPopulated;
	currentSession: Session;
};

export type ApiHandlerContext<A extends AuthGuardOption> = A extends true ? ApiHandlerContextWithAuthGuard : ApiHandleContextBase;

export type ApiHandler<A extends AuthGuardOption> = (request: NextRequest, context: ApiHandlerContext<A>) => Promise<NextResponse> | NextResponse;

export type ApiHandlerOptions<A extends AuthGuardOption> = {
	logErrors?: boolean;
	authGuard?: A;
	rolesWhiteList?: Role[];
	redirect?: string;
}

export const routeHandler = <A extends boolean>(handler: ApiHandler<A>, options?: ApiHandlerOptions<A>) => async (request: NextRequest, { params }: { params: { [key: string]: string } }): Promise<NextResponse> => {

	const { logErrors = true } = options || {};

	try {
		await connectToDatabase();
		const searchParams = Object.fromEntries(request.nextUrl.searchParams.entries());

		if (options?.authGuard) {
			const { session, user } = await setServerAuthGuard({
				rolesWhiteList: options.rolesWhiteList,
				redirect: options.redirect, 
			});
			return await handler(request, {
				params,
				searchParams,
				currentUser: user,
				currentSession: session, 
			} as ApiHandlerContext<A>);
		}

		return await handler(request, {
			params,
			searchParams, 
		} as ApiHandlerContext<A>);
	} catch (error) {
		if (logErrors) {
			console.error(error);
		}
		return sendApiError(error);
	}
};