import { useSession } from 'next-auth/react';
import { Dispatch, SetStateAction, useEffect } from 'react';

type RefreshTokenHandler = {
	setRefetchInterval: Dispatch<SetStateAction<number>>;
}

const RefreshTokenHandler = ({ setRefetchInterval }: RefreshTokenHandler) => {
	const { data: session } = useSession();

	useEffect(() => {
		if(!!session) {
			const expirationDate = new Date(session.expires).getTime();
			const now = new Date().getTime();
			const timeRemaining = Math.round((((expirationDate - 30 * 60 * 1000) - now) / 1000));
			setRefetchInterval(timeRemaining > 0 ? timeRemaining : 0);
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ session ]);

	return null;
};

export default RefreshTokenHandler;