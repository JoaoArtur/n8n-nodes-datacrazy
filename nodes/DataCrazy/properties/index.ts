import { INodeProperties } from 'n8n-workflow';
import { leadsFields, leadsOperations } from './leads';
import { dealsFields, dealsOperations } from './deals';

const resourcesOptions: INodeProperties = {
	displayName: 'Recurso',
	name: 'resource',
	type: 'options',
	noDataExpression: true,
	options: [
		{
			name: 'Leads',
			value: 'leads',
		},
		{
			name: 'Negócios',
			value: 'deals',
		},
	],
	default: 'leads',
};

export const dataCrazyNodeProperties: INodeProperties[] = [
	resourcesOptions,
	...leadsOperations,
	...leadsFields,
	...dealsOperations,
	...dealsFields,
];
