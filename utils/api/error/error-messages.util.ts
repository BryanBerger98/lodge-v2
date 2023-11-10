import { StatusCode, getReasonPhrase } from '../http-status';

import { ApiErrorCode } from './error-codes.util';

import { ApiError } from '.';

const DEFAULT_ERROR_MESSAGE = {
	en: 'An error occured.',
	fr: 'Une erreur s\'est produite.',
};

export const errorMessages: Partial<Record<(ApiErrorCode | StatusCode), { en: string, fr: string }>> = {
	[ ApiErrorCode.USER_NOT_FOUND ]: {
		en: 'User not found.',
		fr: 'Utilisateur introuvable.',
	},
	[ ApiErrorCode.USER_UNEDITABLE ]: {
		en: 'This user is not editable.',
		fr: 'Cet utilisateur ne peut être modifié.',
	},
	[ ApiErrorCode.USER_ALREADY_EXISTS ]: {
		en: 'This user already exists.',
		fr: 'Cet utilisateur est déjà enregistré.',
	},
	[ ApiErrorCode.MISSING_CREDENTIALS ]: {
		en: 'Credentials are missing.',
		fr: 'Identifiants manquants.',
	},
	[ ApiErrorCode.WRONG_AUTH_METHOD ]: {
		en: 'Wrong authentication method.',
		fr: 'Méthode d\'authentification invalide.',
	},
	[ ApiErrorCode.ACCOUNT_DISABLED ]: {
		en: 'This account is disabled.',
		fr: 'Ce compte est désactivé.',
	},
	[ ApiErrorCode.WRONG_PASSWORD ]: {
		en: 'Wrong password.',
		fr: 'Mot de passe incorrect.',
	},
	[ ApiErrorCode.TOKEN_NOT_FOUND ]: {
		en: 'Invalid token.',
		fr: 'Jeton invalide.',
	},
	[ ApiErrorCode.TOKEN_ALREADY_SENT ]: {
		en: 'Token already sent. Wait a minute before sending a new one.',
		fr: 'Jeton déjà envoyé. Attendez une minute avant d\'en envoyer un autre.',
	},
	[ ApiErrorCode.INVALID_TOKEN ]: {
		en: 'Invalid token.',
		fr: 'Jeton invalide.',
	},
	[ ApiErrorCode.INVALID_CSRF_TOKEN ]: {
		en: 'Invalid CSRF token.',
		fr: 'Jeton CSRF invalide.',
	},
	[ StatusCode.UNAUTHORIZED ]: {
		en: 'Unauthorized.',
		fr: 'Non autorisé.',
	},
	[ ApiErrorCode.EMAIL_ALREADY_VERIFIED ]: {
		en: 'Email address already verified.',
		fr: 'L\'adresse email est déjà vérifiée.',
	},
	[ ApiErrorCode.INVALID_INPUT ]: {
		en: 'Invalid input.',
		fr: 'Saisie invalide.',
	},
	[ ApiErrorCode.TOKEN_EXPIRED ]: {
		en: 'Token expired.',
		fr: 'Le jeton a expiré.',
	},
	[ ApiErrorCode.FILE_NOT_FOUND ]: {
		en: 'File not found.',
		fr: 'Fichier introuvable.',
	},
	[ ApiErrorCode.WRONG_FILE_FORMAT ]: {
		en: 'Wrong file format.',
		fr: 'Mauvais format de fichier.',
	},
	[ ApiErrorCode.FILE_TOO_LARGE ]: {
		en: 'The file is too large.',
		fr: 'Le fichier est trop lourd.',
	},
	[ ApiErrorCode.PASSWORD_REQUIRED ]: {
		en: 'Password required.',
		fr: 'Mot de passe requis.',
	},
	[ StatusCode.FORBIDDEN ]: {
		en: 'Forbidden.',
		fr: 'Accès inderdit.',
	},
	[ StatusCode.INTERNAL_SERVER_ERROR ]: {
		en: DEFAULT_ERROR_MESSAGE.en,
		fr: DEFAULT_ERROR_MESSAGE.fr,
	},
	[ StatusCode.NOT_FOUND ]: {
		en: 'Not found.',
		fr: 'Introuvable.',
	},
	[ StatusCode.BAD_REQUEST ]: {
		en: 'Bad request.',
		fr: 'Requête invalide.',
	},
	[ StatusCode.UNPROCESSABLE_ENTITY ]: {
		en: 'Unprocessable entity.',
		fr: 'Entité non traitable.',
	},
	[ StatusCode.TOO_MANY_REQUESTS ]: {
		en: 'Too many requests.',
		fr: 'Trop de requêtes.',
	},
	[ StatusCode.NOT_IMPLEMENTED ]: {
		en: 'Not implemented.',
		fr: 'Non implémenté.',
	},
	[ StatusCode.SERVICE_UNAVAILABLE ]: {
		en: 'Service unavailable.',
		fr: 'Service indisponible.',
	},
	[ StatusCode.GATEWAY_TIMEOUT ]: {
		en: 'Gateway timeout.',
		fr: 'Délai d\'attente dépassé.',
	},
	[ StatusCode.REQUEST_TIMEOUT ]: {
		en: 'Request timeout.',
		fr: 'Délai d\'attente dépassé.',
	},
	[ StatusCode.REQUEST_TOO_LONG ]: {
		en: 'Request too long.',
		fr: 'Requête trop longue.',
	},
	[ StatusCode.REQUEST_HEADER_FIELDS_TOO_LARGE ]: {
		en: 'Request header fields too large.',
		fr: 'En-têtes de requête trop volumineux.',
	},
	[ StatusCode.UNSUPPORTED_MEDIA_TYPE ]: {
		en: 'Unsupported media type.',
		fr: 'Type de média non supporté',
	},
};

export const getErrorMessage = (apiError: ApiError<unknown>, options?: { locale: 'fr' | 'en' }): string => {
	const code = apiError.code || apiError.status;
	const errorMessageObject = code ? errorMessages[ code ] : undefined;
	return errorMessageObject ? errorMessageObject[ options?.locale || 'en' ] : code ? `${ getReasonPhrase(code) }.` : DEFAULT_ERROR_MESSAGE[ options?.locale || 'en' ];
};