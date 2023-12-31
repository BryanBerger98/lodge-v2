import { render } from '@react-email/render';

import { MailOptions, SMTPTransport, sendMail } from '@/lib/mailer';
import { IToken } from '@/schemas/token.schema';
import { User } from '@/schemas/user';
import { IUserPopulated } from '@/schemas/user/populated.schema';

import EmailVerification from './templates/EmailVerification';
import MagicLinkSignIn from './templates/MagicLinkSignIn';
import NewEmailConfirmation from './templates/NewEmailConfirmation';
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

export const sendMagicLinkSignInEmail = (user: User | IUserPopulated, url: string) => {
	return new Promise((resolve, reject) => {
		const htmlBody = render(MagicLinkSignIn({
			url,
			appName,
		}));
		const emailSubject = `${ appName } - Sign in`;
		const emailPlainText = `${ appName } - Sign in`;
		sendEmail(user.email, [], [], emailSubject, emailPlainText, htmlBody)
			.then(resolve).catch(reject);
	});
};

export const sendAccountVerificationEmail = (user: User | IUserPopulated, token: IToken) => {
	return new Promise((resolve, reject) => {
		const tokenLink = `${ process.env.FRONT_URL }/verify-email/${ token.token }`;
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

export const sendResetPasswordEmail = (user: User | IUserPopulated, token: IToken) => {
	return new Promise((resolve, reject) => {
		const tokenLink = `${ process.env.FRONT_URL }/forgot-password/${ token.token }`;
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

export const sendNewEmailConfirmationEmail = (user: User | IUserPopulated, token: IToken) => {
	return new Promise((resolve, reject) => {
		if (!user.new_email) {
			reject(new Error('User does not have a new email address.'));
			return;
		}
		const tokenLink = `${ process.env.FRONT_URL }/confirm-new-email/${ token.token }`;
		const htmlBody = render(NewEmailConfirmation({
			user,
			tokenLink,
			appName,
		}));
		const emailSubject = `${ appName } - Confirm your new email address`;
		const emailPlainText = `${ appName } - Confirm your new email address`;
		sendEmail(user.new_email, [], [], emailSubject, emailPlainText, htmlBody)
			.then(resolve).catch(reject);
	});
};