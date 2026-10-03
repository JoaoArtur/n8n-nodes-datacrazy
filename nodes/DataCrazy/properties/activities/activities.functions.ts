import { IExecuteFunctions } from 'n8n-workflow';
import { request } from '../../GenericFunctions';
import {
	IActivity,
	IActivityCreate,
	IActivityFilter,
	IActivityQueryParams,
	IActivityResponse,
	IActivityUpdate,
} from './activities.types';

/**
 * Buscar todas as atividades
 */
export async function getAllActivities(
	this: IExecuteFunctions,
	queryParams: IActivityQueryParams = {},
): Promise<IActivityResponse> {
	const endpoint = '/activities';
	return await request(this, 'GET', endpoint, undefined, queryParams);
}

/**
 * Criar uma nova atividade
 */
export async function createActivity(
	this: IExecuteFunctions,
	activityData: IActivityCreate,
): Promise<IActivity> {
	const endpoint = '/activities';
	return await request(this, 'POST', endpoint, activityData);
}

/**
 * Buscar atividade por ID
 */
export async function getActivityById(this: IExecuteFunctions, activityId: string): Promise<IActivity> {
	const endpoint = `/activities/${activityId}`;
	return await request(this, 'GET', endpoint);
}

/**
 * Atualizar atividade
 */
export async function updateActivity(
	this: IExecuteFunctions,
	activityId: string,
	activityData: IActivityUpdate,
): Promise<IActivity> {
	const endpoint = `/activities/${activityId}`;
	return await request(this, 'PATCH', endpoint, activityData);
}

/**
 * Excluir atividade
 */
export async function deleteActivity(this: IExecuteFunctions, activityId: string): Promise<void> {
	const endpoint = `/activities/${activityId}`;
	return await request(this, 'DELETE', endpoint);
}

function isFilled(value: unknown): boolean {
	return value !== undefined && value !== null && value !== '';
}

function toRef(id: unknown): { id: string } | undefined {
	return isFilled(id) ? { id: String(id) } : undefined;
}

// A API exige ISO 8601 com timezone; o campo dateTime do n8n vem sem.
function toISODate(value: unknown): unknown {
	const date = new Date(String(value));
	return isNaN(date.getTime()) ? value : date.toISOString();
}

const DATE_FIELDS = ['startDate', 'endDate', 'startDateLessThan'];

/**
 * Função auxiliar para construir dados da atividade
 */
export function buildActivityData(data: any): IActivityCreate | IActivityUpdate {
	const activityData: any = {};

	const plainFields = ['title', 'description', 'startDate', 'endDate', 'required', 'linkToStage'];
	plainFields.forEach((field) => {
		if (isFilled(data[field])) {
			activityData[field] = DATE_FIELDS.includes(field) ? toISODate(data[field]) : data[field];
		}
	});

	const refFields: Record<string, string> = {
		lead: 'leadId',
		attendant: 'attendantId',
		business: 'businessId',
		activityType: 'activityTypeId',
		flow: 'flowId',
	};
	Object.entries(refFields).forEach(([bodyKey, inputKey]) => {
		const ref = toRef(data[inputKey]);
		if (ref) {
			activityData[bodyKey] = ref;
		}
	});

	return activityData;
}

/**
 * Função auxiliar para construir os parâmetros de busca de atividades
 */
export function buildActivityQueryParams(options: any): IActivityQueryParams {
	const queryParams: IActivityQueryParams = {};

	if (isFilled(options.skip)) {
		queryParams.skip = options.skip;
	}

	if (isFilled(options.take)) {
		queryParams.take = options.take;
	}

	if (isFilled(options.search)) {
		queryParams.search = options.search;
	}

	const filters = options.filters || {};
	const filter: IActivityFilter = {};
	const filterKeys: Array<keyof IActivityFilter> = [
		'attendantId',
		'startDate',
		'startDateLessThan',
		'typeId',
		'isCompleted',
	];
	filterKeys.forEach((key) => {
		if (isFilled(filters[key])) {
			(filter as any)[key] = DATE_FIELDS.includes(key) ? toISODate(filters[key]) : filters[key];
		}
	});

	if (Object.keys(filter).length > 0) {
		queryParams.filter = filter;
	}

	return queryParams;
}
