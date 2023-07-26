import { render } from '@react-email/render';

import { MailOptions, SMTPTransport, sendMail } from '@/lib/mailer';
import { IToken } from '@/types/token.type';
import { IUser } from '@/types/user.type';

import EmailVerification from './templates/EmailVerification';
import ResetPassword from './templates/ResetPassword';

const appName = process.env.NEXT_PUBLIC_APP_NAME;

export const sendEmail = async (to: string, cc: string[], bcc: string[], subject: string, plainText: string, htmlBody: string): Promise<SMTPTransport.SentMessageInfo> => {

	const mailOptions: MailOptions = {
		from: `"${ appName } - Do not reply" <${ process.env.EMAIL_FROM }>`,
		to,
		cc,
		bcc,
		subject,
		text: plainText,
		html: htmlBody,
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
		// const htmlBody = getEmailVerificationTemplate(user, tokenLink);
		const htmlBody = render(EmailVerification({
			user,
			tokenLink,
			appName,
		}));
		const emailSubject = `${ appName } - Verify your email address`;
		const emailPlainText = `${ appName } - Verify your email address`;
		sendEmail(user.email, [], [], emailSubject, emailPlainText, htmlBody)
			.then(resolve).catch(reject);
	});
};

export const sendResetPasswordEmail = (user: IUser, token: IToken) => {
	return new Promise((resolve, reject) => {
		const tokenLink = `${ process.env.FRONT_URL }/forgot-password/${ token.token }`;
		// const htmlBody = getResetPasswordTemplate(user, tokenLink);
		const htmlBody = render(ResetPassword({
			user,
			tokenLink,
			appName,
		}));
		const emailSubject = `${ appName } - Reset your password`;
		const emailPlainText = `${ appName } - Reset your password`;
		sendEmail(user.email, [], [], emailSubject, emailPlainText, htmlBody)
			.then(resolve).catch(reject);
	});
};