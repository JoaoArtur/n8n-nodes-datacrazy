import { INodeProperties } from 'n8n-workflow';
import { leadsFields, leadsOperations } from './leads';
import { dealsFields, dealsOperations } from './deals';
import { attachmentsFields, attachmentsOperations } from './attachments';
import { annotationsFields, annotationsOperations } from './annotations';
import { tagsFields, tagsOperations } from './tags';
import { dealActionsOperations, dealIds, destinationStageId, lossReasonId, justification, additionalFields } from './deal-actions';
import { pipelinesOperations, pipelineTake, pipelineSkip, pipelineSearch, pipelineId } from './pipelines';

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
		{
			name: 'Ações de Negócios',
			value: 'dealActions',
		},
		{
			name: 'Pipelines',
			value: 'pipelines',
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
	...dealActionsOperations,
	dealIds,
	destinationStageId,
	lossReasonId,
	justification,
	additionalFields,
	...pipelinesOperations,
	pipelineTake,
	pipelineSkip,
	pipelineSearch,
	pipelineId,
];
