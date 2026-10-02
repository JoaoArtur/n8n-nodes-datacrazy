import { ILoadOptionsFunctions, INodePropertyOptions } from 'n8n-workflow';
import { API_HOST, requestForLoadOptions } from '../../GenericFunctions';
import type { IDepartmentsResponse } from './departments.types';

export async function getDepartmentsForLoadOptions(
	this: ILoadOptionsFunctions,
): Promise<INodePropertyOptions[]> {
	const queryParams = {
		take: 100,
		skip: 0,
	};

	const response = await requestForLoadOptions(
		this,
		'GET',
		'/departments',
		undefined,
		queryParams,
		`${API_HOST}/api/messaging`,
	);

	const departmentsResponse = response as IDepartmentsResponse;

	return departmentsResponse.data.map((department) => ({
		name: department.name,
		value: department.id,
	}));
}