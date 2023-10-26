import { z } from 'zod';

export enum Environment {
	DEVELOPMENT = 'Development',
	STAGING = 'Staging',
	PRODUCTION = 'Production',
};

const DatabaseEnvironmentSchema = z.object({
	DB_USER: z.string().optional(),
	DB_PASSWORD: z.string().optional(),
	DB_NAME: z.string().optional(),
	DB_CLUSTER: z.string().optional(),
});

const EmailEnvironmentSchema = z.object({
	EMAIL_HOST: z.string().optional(),
	EMAIL_PORT: z.string().optional(),
	EMAIL_USER: z.string().optional(),
	EMAIL_PASSWORD: z.string().optional(),
	EMAIL_FROM: z.string().optional(),
});

const S3BucketEnvironmentSchema = z.object({
	BUCKET_NAME: z.string().optional(),
	BUCKET_REGION: z.string().optional(),
	BUCKET_ACCESS_KEY_ID: z.string().optional(),
	BUCKET_SECRET_ACCESS_KEY: z.string().optional(),
	BUCKET_POLICY_VERSION: z.string().optional(),
});

const SecurityEnvironmentSchema = z.object({
	JWT_SECRET: z.string().optional(),
	CSRF_SECRET: z.string().optional(),
	FRONT_URL: z.string().optional(),
	NEXTAUTH_URL: z.string().optional(),
});

const GoogleAuthEnvironmentSchema = z.object({
	GOOGLE_CLIENT_ID: z.string().optional(),
	GOOGLE_CLIENT_SECRET: z.string().optional(),
});

const EnvSchema = z.object({
	APP_NAME: z.string().optional(),
	NEXT_PUBLIC_APP_NAME: z.string().optional(),
	ENVIRONMENT: z.nativeEnum(Environment),
	NEXT_PUBLIC_ENVIRONMENT: z.nativeEnum(Environment),
})
	.merge(DatabaseEnvironmentSchema)
	.merge(EmailEnvironmentSchema)
	.merge(S3BucketEnvironmentSchema)
	.merge(SecurityEnvironmentSchema)
	.merge(GoogleAuthEnvironmentSchema);

export const Env = EnvSchema.parse({
	...process.env,
	NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
	NEXT_PUBLIC_ENVIRONMENT: process.env.NEXT_PUBLIC_ENVIRONMENT,
});

export const DEVELOPMENT_ENV = 'Development';
export const STAGING_ENV = 'Staging';
export const PRODUCTION_ENV = 'Production';

export const isProductionEnv = (env?: Environment) => {
	return env && env === Environment.PRODUCTION;
};