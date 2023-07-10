type ConvertibleObject = Record<string, string | boolean | number | Blob | File | null | undefined >;

export const objectToFormData = (objectToConvert: ConvertibleObject) => {
	const formData = new FormData();
	for (const [ key, value ] of Object.entries(objectToConvert)) {
		if (value) {
			let parsedValue = value;
			switch (typeof value) {
				case 'number':
					parsedValue = value.toString();					
					break;
				case 'boolean':
					parsedValue = value.toString();					
					break;
				default:
					parsedValue = value;
					break;
			}
			formData.append(key, parsedValue);
		}
	}
	return formData;
};