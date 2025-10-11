import { INodeProperties } from 'n8n-workflow';
import { leadsFields, leadsOperations } from './leads';
import { dealsFields, dealsOperations } from './deals';
import { attachmentsFields, attachmentsOperations } from './attachments';
import { annotationsFields, annotationsOperations } from './annotations';
import { tagsFields, tagsOperations } from './tags';

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
		{
			name: 'Anexos',
			value: 'attachments',
		},
		{
			name: 'Anotações',
			value: 'annotations',
		},
		{
			name: 'Tags',
			value: 'tags',
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
	...attachmentsOperations,
	...attachmentsFields,
	...annotationsOperations,
	...annotationsFields,
	...tagsOperations,
	...tagsFields,
];
