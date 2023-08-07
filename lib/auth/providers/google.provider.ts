import Google, { GoogleProfile } from 'next-auth/providers/google';

const GoogleProvider = process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET ?
	Google({
		clientId: process.env.GOOGLE_CLIENT_ID,
		clientSecret: process.env.GOOGLE_CLIENT_SECRET,
		profile: (profile: GoogleProfile) => {
			return {
				id: profile.sub,
				username: profile.name,
				email: profile.email,
				photo_url: profile.picture,
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