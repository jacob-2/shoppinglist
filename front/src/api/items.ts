
const apiRoot = 'http://localhost:3001/api/items';

export const ItemsAPI = {
	// GET
	list: async (from = 1, limit = 20) =>
		api<Item[]>(`${apiRoot}/?from=${from}&limit=${limit}`, true),

	// POST
	newItem: async (it: NewItem) =>
		api<null>(apiRoot, false, 'POST', it),
	updateItem: async (it: Item) =>
		api<null>(`${apiRoot}/${it.id}`, false, 'POST', it),

	// DELETE
	deleteItem: async (id: number) =>
		api<null>(`${apiRoot}/${id}`, false, 'DELETE'),
}

type ApiResult<Data> = {} | {error: string;} | {data: Data;};

export interface Item extends NewItem {
	id: number;
}

export interface NewItem {
	title: string;
	description: string;
	quantity?: number;
	purchased: boolean;
}

type Method = 'GET' | 'POST' | 'DELETE';
async function api<ResultData>(
	path: string, jsonResponse?: boolean, method: Method = 'GET', data?: any
): Promise<ApiResult<ResultData>> {
	if(data !== undefined)
		data = JSON.stringify(data);
	return fetch(path, {
		method: method,
		body: data
	})
		.then<ApiResult<ResultData>>(r => (jsonResponse? r.json() : {}) as Promise<ApiResult<ResultData>>)
		.catch(() => ({ error: 'An error has occurred.' }));
}

