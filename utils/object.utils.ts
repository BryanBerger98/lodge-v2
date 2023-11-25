type ConvertibleObject = Record<string, string | boolean | number | Date | Blob | null | undefined >;

const parseValue = (value: ConvertibleObject[keyof ConvertibleObject]) => {
	if (value === null) {
		return null;
	};
	if (value instanceof Date) {
		return value.toISOString();
	}
	if (value instanceof Blob) {
		return value;
	}
	switch (typeof value) {
		case 'number':
			return value.toString();
		case 'boolean':
			return value.toString();
		case 'undefined':
			return null;
		default:
			return value;
	}
};

export const objectToFormData = (objectToConvert: ConvertibleObject) => {
	const formData = new FormData();
	for (const [ key, value ] of Object.entries(objectToConvert)) {
		const parsedValue = parseValue(value);
		if (parsedValue !== null) {
			formData.append(key, parsedValue);
		}
	}
	return formData;
};