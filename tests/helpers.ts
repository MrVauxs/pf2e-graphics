type Flatten<T extends object> = {
	[K in keyof T]: T[K] extends object
		? T[K] extends Array<any>
			? T[K]
			: Flatten<T[K]> extends infer F
				? { [P in keyof F as `${Extract<K, string>}.${Extract<P, string>}`]: F[P] }
				: never
		: T[K];
}[keyof T];

export function flatten<T extends object>(obj: T, parentKey: string = ''): Flatten<T> {
	let result = {} as any;

	for (const key in obj) {
		if (Object.prototype.hasOwnProperty.call(obj, key)) {
			const newKey = parentKey ? `${parentKey}.${key}` : key;
			const value = obj[key];

			if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
				result = { ...result, ...flatten(value, newKey) };
			} else {
				result[newKey] = value;
			}
		}
	}

	return result;
}
