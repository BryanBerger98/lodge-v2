import Google, { GoogleProfile } from 'next-auth/providers/google';

import { createFile } from '@/database/file/file.repository';
import { connectToDatabase } from '@/lib/database';

const GoogleProvider = process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET ?
	Google({
		clientId: process.env.GOOGLE_CLIENT_ID,
		clientSecret: process.env.GOOGLE_CLIENT_SECRET,
		profile: async (profile: GoogleProfile) => {
			await connectToDatabase();
			const file = await createFile({
				key: '',
				url: profile.picture,
				created_by: null,
				size: 0,
				mimetype: '',
				original_name: '',
				custom_name: '',
				extension: '',
				url_expiration_date: null,
			});

			return {
				id: profile.sub,
				username: profile.name,
				email: profile.email,
				photo: file,
				photo_file: null,
				role: 'user',
				provider_data: 'google',
				is_disabled: false,
				has_email_verified: profile.email_verified,
				phone_number: '',
				created_at: new Date(),
				updated_at: null,
				created_by: null,
				updated_by: null,
				photo_key: null,
				last_login_date: new Date(),
				has_password: false,
			};
		},
	}) : null;

export default GoogleProvider;