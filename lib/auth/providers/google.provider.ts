import Google, { GoogleProfile } from 'next-auth/providers/google';

import { createFile } from '@/database/file/file.repository';
import { findPopulatedUserByEmail } from '@/database/user/user.repository';
import { connectToDatabase } from '@/lib/database';
import { AuthenticationProvider } from '@/schemas/authentication-provider';
import { MimeType } from '@/schemas/file/mime-type.schema';
import { Role } from '@/schemas/role.schema';

const GoogleProvider = process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET ?
	Google({
		allowDangerousEmailAccountLinking: true,
		clientId: process.env.GOOGLE_CLIENT_ID,
		clientSecret: process.env.GOOGLE_CLIENT_SECRET,
		profile: async (profile: GoogleProfile) => {
			await connectToDatabase();

			const existingUser = await findPopulatedUserByEmail(profile.email);

			if (existingUser) {
				return existingUser;
			}

			const file = await createFile({
				key: profile.picture,
				url: profile.picture,
				created_by: null,
				size: 0,
				mime_type: MimeType.UNKNOWN,
				original_name: '',
				custom_name: '',
				extension: '',
				url_expiration_date: null,
			});

			return {
				id: profile.sub,
				username: profile.name,
				email: profile.email,
				first_name: profile.given_name,
				last_name: profile.family_name,
				photo: file,
				role: Role.USER,
				provider_data: AuthenticationProvider.GOOGLE,
				is_disabled: false,
				has_email_verified: profile.email_verified,
				phone_number: '',
				created_at: new Date(),
				has_password: false,
				updated_at: null,
				created_by: null,
				updated_by: null,
				last_login_date: new Date(),
			};
		},
	}) : null;

export default GoogleProvider;