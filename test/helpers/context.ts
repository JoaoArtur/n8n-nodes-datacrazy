import type { IExecuteFunctions, ILoadOptionsFunctions, INodeExecutionData } from 'n8n-workflow';
import { DataCrazy } from '../../nodes/DataCrazy/DataCrazy.node';

export const BASE = 'https://api.g1.datacrazy.io/api/v1';

export interface CapturedRequest {
	method: string;
	url: string;
	path: string;
	query: Record<string, string>;
	body: unknown;
	headers: Record<string, string>;
}

type Responder = (req: CapturedRequest) => unknown;

function capture(options: any): CapturedRequest {
	const parsed = new URL(options.url);
	const query: Record<string, string> = {};
	parsed.searchParams.forEach((value, key) => {
		query[key] = value;
	});
	return {
		method: options.method,
		url: `${parsed.origin}${parsed.pathname}`,
		path: parsed.pathname,
		query,
		body: options.body,
		headers: options.headers,
	};
}

function readParam(params: Record<string, unknown>, name: string, fallback: unknown): unknown {
	const value = name
		.split('.')
		.reduce<any>((obj, key) => (obj == null ? undefined : obj[key]), params);
	if (value !== undefined) return value;
	if (fallback !== undefined) return fallback;
	throw new Error(`Parâmetro obrigatório ausente no teste: ${name}`);
}

export interface RunOptions {
	responder?: Responder;
	continueOnFail?: boolean;
}

export interface RunResult {
	requests: CapturedRequest[];
	output: INodeExecutionData[];
}

/**
 * Executa o node com os parâmetros informados, capturando as requisições HTTP.
 */
export async function runNode(
	params: Record<string, unknown>,
	{ responder = () => ({}), continueOnFail = false }: RunOptions = {},
): Promise<RunResult> {
	const requests: CapturedRequest[] = [];
	const context = {
		getInputData: () => [{ json: {} }],
		getNodeParameter: (name: string, _i: number, fallback?: unknown) =>
			readParam(params, name, fallback),
		getCredentials: async () => ({ apiKey: 'test-key' }),
		getNode: () => ({ name: 'DataCrazy' }),
		continueOnFail: () => continueOnFail,
		helpers: {
			request: async (options: any) => {
				const req = capture(options);
				requests.push(req);
				return responder(req);
			},
		},
	} as unknown as IExecuteFunctions;

	const [output] = await new DataCrazy().execute.call(context);
	return { requests, output };
}

/**
 * Executa um método de loadOptions do node.
 */
export async function runLoadOptions(
	method: string,
	currentParams: Record<string, unknown> = {},
	responder: Responder = () => ({ data: [] }),
) {
	const requests: CapturedRequest[] = [];
	const context = {
		getCurrentNodeParameter: (name: string) => readParam(currentParams, name, ''),
		getCredentials: async () => ({ apiKey: 'test-key' }),
		getNode: () => ({ name: 'DataCrazy' }),
		helpers: {
			request: async (options: any) => {
				const req = capture(options);
				requests.push(req);
				return responder(req);
			},
		},
	} as unknown as ILoadOptionsFunctions;

	const loadOptions = new DataCrazy().methods.loadOptions as Record<string, Function>;
	const result = await loadOptions[method].call(context);
	return { requests, result };
}

/**
 * Atalho para operações que fazem uma única requisição.
 */
export async function single(params: Record<string, unknown>): Promise<CapturedRequest> {
	const { requests } = await runNode(params);
	if (requests.length !== 1) {
		throw new Error(`Esperava 1 requisição, recebeu ${requests.length}`);
	}
	return requests[0];
}
