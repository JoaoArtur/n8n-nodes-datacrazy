import { INodeProperties } from 'n8n-workflow';
import { leadsFields, leadsOperations } from './leads';
import { dealsFields, dealsOperations } from './deals';
import { attachmentsFields, attachmentsOperations } from './attachments';
import { annotationsFields, annotationsOperations } from './annotations';
import { tagsFields, tagsOperations } from './tags';
import { conversationsFields, conversationsOperations } from './conversations';
import { additionalFieldsFields, additionalFieldsOperations } from './additional-fields';
export * from './instances';
import { dealActionsOperations, dealIds, destinationPipelineId, destinationStageId, lossReasonId, justification, additionalFields } from './deal-actions';
import { activitiesFields, activitiesOperations } from './activities';
import { listsFields, listsOperations } from './lists';
import { productsFields, productsOperations } from './products';
import { dealAttachmentsFields, dealAttachmentsOperations } from './deal-attachments';
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
			name: 'Conversas',
			value: 'conversations',
		},
		{
			name: 'Ações de Negócios',
			value: 'dealActions',
		},
		{
			name: 'Pipelines',
			value: 'pipelines',
		},
		{
			name: 'Atividades',
			value: 'activities',
		},
		{
			name: 'Listas',
			value: 'lists',
		},
		{
			name: 'Produtos',
			value: 'products',
		},
		{
			name: 'Anexos de Negócio',
			value: 'dealAttachments',
		},
		{
			name: 'Campos Adicionais',
			value: 'additionalFields',
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
	...conversationsOperations,
	...conversationsFields,
	...additionalFieldsOperations,
	...additionalFieldsFields,
	...dealActionsOperations,
	dealIds,
	destinationPipelineId,
	destinationStageId,
	lossReasonId,
	justification,
	additionalFields,
	...pipelinesOperations,
	pipelineTake,
	pipelineSkip,
	pipelineSearch,
	pipelineId,
	...activitiesOperations,
	...activitiesFields,
	...listsOperations,
	...listsFields,
	...productsOperations,
	...productsFields,
	...dealAttachmentsOperations,
	...dealAttachmentsFields,
];
