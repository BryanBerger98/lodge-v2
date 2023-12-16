import { EffectCallback, useEffect, useRef } from 'react';

const useUpdateEffect = (effect: EffectCallback, dependencies: any[] = []) => {
	const isMounted = useRef(true);
	useEffect(() => {
		if (isMounted.current) {
			isMounted.current = false;
		} else {
			return effect();
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, dependencies);
};

export default useUpdateEffect;