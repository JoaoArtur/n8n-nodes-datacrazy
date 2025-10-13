import { ILoadOptionsFunctions, INodePropertyOptions } from 'n8n-workflow';
import { requestForLoadOptions } from '../../GenericFunctions';
import type { IDepartmentsResponse } from './departments.types';

export async function getDepartmentsForLoadOptions(
	this: ILoadOptionsFunctions,
): Promise<INodePropertyOptions[]> {
	const queryParams = {
		take: 100,
		skip: 0,
		url: '/departments',
	};

	const response = await requestForLoadOptions(
		this,
		'GET',
		'/api/messaging/departments',
		{},
		queryParams,
	);

	const departmentsResponse = response as IDepartmentsResponse;

	return departmentsResponse.data.map((department) => ({
		name: department.name,
		value: department.id,
	}));
}