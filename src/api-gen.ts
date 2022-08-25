import consola from 'consola';
import got from 'got';
import stringify from 'json-stringify-pretty-compact';
import * as fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'pathe';

export interface APIResponse {
	family: string;
	variants: string[];
	subsets: string[];
	version: string;
	lastModified: string;
	category: string;
}
interface GotResponse {
	items: APIResponse[];
}

const fetchURL = async (url: string): Promise<void> => {
	// Have to double assert to please esbuild
	const response = (await got(url).json()) as unknown as GotResponse;
	await fs.writeFile(
		join(dirname(fileURLToPath(import.meta.url)), '../data/api-response.json'),
		stringify(response.items)
	);
};

const baseurl =
	'https://www.googleapis.com/webfonts/v1/webfonts?fields=items(category%2Cfamily%2ClastModified%2Csubsets%2Cvariants%2Cversion)&key=';

export const fetchAPI = async (key: string): Promise<void> => {
	if (key) {
		try {
			await fetchURL(baseurl + key);
			consola.success('Successful Google Font API fetch.');
		} catch (error) {
			throw new Error(`API fetch error: ${error}`);
		}
	} else {
		throw new Error('The API key is required!');
	}
};
