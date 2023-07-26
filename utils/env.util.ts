export const DEVELOPMENT_ENV = 'Development';
export const STAGING_ENV = 'Staging';
export const PRODUCTION_ENV = 'Production';

export const isProductionEnv = (env?: string) => {
	return env && env === PRODUCTION_ENV;
};