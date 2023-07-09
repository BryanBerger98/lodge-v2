import { ACCOUNT_DISABLED_ERROR, DEFAULT_ERROR, EMAIL_ALREADY_VERIFIED_ERROR, FILE_NOT_FOUND_ERROR, FILE_TOO_LARGE_ERROR, INTERNAL_ERROR, INVALID_INPUT_ERROR, INVALID_TOKEN_ERROR, MISSING_CREDENTIALS_ERROR, PASSWORD_REQUIRED_ERROR, TOKEN_ALREADY_SENT_ERROR, TOKEN_EXPIRED_ERROR, TOKEN_NOT_FOUND_ERROR, UNAUTHORIZED_ERROR, USER_ALREADY_EXISTS_ERROR, USER_NOT_FOUND_ERROR, WRONG_FILE_FORMAT_ERROR, WRONG_PASSWORD_ERROR } from './error-codes';

export const errorMessages: Record<string, { en: string, fr: string }> = {
	[ USER_NOT_FOUND_ERROR ]: {
		en: 'User not found.',
		fr: 'Utilisateur introuvable.',
	},
	[ USER_ALREADY_EXISTS_ERROR ]: {
		en: 'This user already exists.',
		fr: 'Cet utilisateur est déjà enregistré.',
	},
	[ MISSING_CREDENTIALS_ERROR ]: {
		en: 'Credentials are missing.',
		fr: 'Identifiants manquants.',
	},
	[ ACCOUNT_DISABLED_ERROR ]: {
		en: 'This account is disabled.',
		fr: 'Ce compte est désactivé.',
	},
	[ WRONG_PASSWORD_ERROR ]: {
		en: 'Wrong password.',
		fr: 'Mot de passe incorrect.',
	},
	[ TOKEN_NOT_FOUND_ERROR ]: {
		en: 'Invalid token.',
		fr: 'Jeton invalide.',
	},
	[ TOKEN_ALREADY_SENT_ERROR ]: {
		en: 'Token already sent.',
		fr: 'Jeton déjà envoyé.',
	},
	[ INVALID_TOKEN_ERROR ]: {
		en: 'Invalid token.',
		fr: 'Jeton invalide.',
	},
	[ UNAUTHORIZED_ERROR ]: {
		en: 'Unauthorized.',
		fr: 'Non autorisé.',
	},
	[ EMAIL_ALREADY_VERIFIED_ERROR ]: {
		en: 'Email address already verified.',
		fr: 'L\'adresse email est déjà vérifiée.',
	},
	[ INVALID_INPUT_ERROR ]: {
		en: 'Invalid input.',
		fr: 'Saisie invalide.',
	},
	[ TOKEN_EXPIRED_ERROR ]: {
		en: 'Token expired.',
		fr: 'Le jeton a expiré.',
	},
	[ FILE_NOT_FOUND_ERROR ]: {
		en: 'File not found.',
		fr: 'Fichier introuvable.',
	},
	[ WRONG_FILE_FORMAT_ERROR ]: {
		en: 'Wrong file format.',
		fr: 'Mauvais format de fichier.',
	},
	[ FILE_TOO_LARGE_ERROR ]: {
		en: 'The file is too large.',
		fr: 'Le fichier est trop lourd.',
	},
	[ PASSWORD_REQUIRED_ERROR ]: {
		en: 'Password required.',
		fr: 'Mot de passe requis.',
	},
	[ DEFAULT_ERROR ]: {
		en: 'An error occured.',
		fr: 'Une erreur s\'est produite.',
	},
	[ INTERNAL_ERROR ]: {
		en: 'An error occured.',
		fr: 'Une erreur s\'est produite.',
	},
};