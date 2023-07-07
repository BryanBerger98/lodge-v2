import { MailOptions, SMTPTransport, sendMail } from '@/lib/mailer';
import { IToken } from '@/types/token.type';
import { IUser } from '@/types/user.type';

import { getMainTemplateBody } from './templates';
import getEmailVerificationTemplate from './templates/email-verification';
import getResetPasswordTemplate from './templates/reset-password';

const appName = process.env.NEXT_PUBLIC_APP_NAME;

export const sendEmail = async (to: string, cc: string[], bcc: string[], subject: string, plainText: string, htmlBody: string): Promise<SMTPTransport.SentMessageInfo> => {

	const mailOptions: MailOptions = {
		from: `"${ appName } - Ne pas répondre" <${ process.env.EMAIL_USER }>`,
		to,
		cc,
		bcc,
		subject,
		text: plainText,
		html: getMainTemplateBody(htmlBody),
	};

	try {
		const response = await sendMail(mailOptions);
		return response;
	} catch (error) {
		throw error;
	}
};

export const sendAccountVerificationEmail = (user: IUser, token: IToken) => {
	return new Promise((resolve, reject) => {
		const tokenLink = `${ process.env.FRONT_URL }/verify-email/${ token.token }`;
		const htmlBody = getEmailVerificationTemplate(user, tokenLink);
		const emailSubject = `${ appName } - Confirmation de l\'adresse email`;
		const emailPlainText = `${ appName } - Confirmation de l\'adresse email`;
		sendEmail(user.email, [], [], emailSubject, emailPlainText, htmlBody)
			.then(resolve).catch(reject);
	});
};

export const sendResetPasswordEmail = (user: IUser, token: IToken) => {
	return new Promise((resolve, reject) => {
		const tokenLink = `${ process.env.FRONT_URL }/forgot-password/${ token.token }`;
		const htmlBody = getResetPasswordTemplate(user, tokenLink);
		const emailSubject = `${ appName } - Réinitialisation de votre mot de passe`;
		const emailPlainText = `${ appName } - Réinitialisation de votre mot de passe`;
		sendEmail(user.email, [], [], emailSubject, emailPlainText, htmlBody)
			.then(resolve).catch(reject);
	});
};