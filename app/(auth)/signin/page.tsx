import dynamic from 'next/dynamic';
import { redirect } from 'next/navigation';

import { findSettingByName } from '@/database/setting/setting.repository';
import { connectToDatabase } from '@/lib/database';
import { SettingName, UnregisteredSettingBooleanPopulatedSchema } from '@/schemas/setting';
import { getServerCurrentUser } from '@/utils/auth';

import SignInProvider from './_context/provider';

const SignInCard = dynamic(() => import('./_components/SignInCard'));
const EmailSignInForm = dynamic(() => import('./_components/EmailSignInForm'));
const PasswordSignInForm = dynamic(() => import('./_components/PasswordSignInForm'));
const MagicEmailSent = dynamic(() => import('./_components/MagicEmailSent'));

const SignInPage = async () => {

	await connectToDatabase();

	const currentUser = await getServerCurrentUser();

	if (currentUser) {
		redirect('/');
	}

	const newUserSignUpSettingData = await findSettingByName(SettingName.NEW_USERS_SIGNUP);
	const newUserSignUpSetting = UnregisteredSettingBooleanPopulatedSchema.parse(newUserSignUpSettingData);
	const userVerifyEmailSettingData = await findSettingByName(SettingName.USER_VERIFY_EMAIL);
	const userVerifyEmailSetting = UnregisteredSettingBooleanPopulatedSchema.parse(userVerifyEmailSettingData);
	const magicLinkSignInSettingData = await findSettingByName(SettingName.MAGIC_LINK_SIGNIN);
	const magicLinkSignInSetting = UnregisteredSettingBooleanPopulatedSchema.parse(magicLinkSignInSettingData);
	const credentialsSignInSettingData = await findSettingByName(SettingName.CREDENTIALS_SIGNIN);
	const credentialsSignInSetting = UnregisteredSettingBooleanPopulatedSchema.parse(credentialsSignInSettingData);

	const googleAuthSettingData = await findSettingByName(SettingName.GOOGLE_AUTH);
	const googleAuthSetting = UnregisteredSettingBooleanPopulatedSchema.parse(googleAuthSettingData);
	const appleAuthSettingData = await findSettingByName(SettingName.APPLE_AUTH);
	const appleAuthSetting = UnregisteredSettingBooleanPopulatedSchema.parse(appleAuthSettingData);

	return (
		<div className="min-h-screen flex justify-center items-center">
			<SignInProvider>
				<SignInCard>
					<EmailSignInForm
						appleAuthSetting={ appleAuthSetting }
						googleAuthSetting={ googleAuthSetting }
						newUserSignUpSetting={ newUserSignUpSetting }
					/>
					<PasswordSignInForm
						credentialsSignInSetting={ credentialsSignInSetting }
						magicLinkSignInSetting={ magicLinkSignInSetting }
						userVerifyEmailSetting={ userVerifyEmailSetting }
					/>
					<MagicEmailSent />
				</SignInCard>
			</SignInProvider>
		</div>
	);
};

export default SignInPage;