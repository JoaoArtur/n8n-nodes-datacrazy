import type { INodeProperties } from 'n8n-workflow';

export const pipelineTake: INodeProperties = {
	displayName: 'Limite (Take)',
	name: 'take',
	type: 'number',
	default: 500,
	description: 'Número máximo de pipelines a serem retornados',
	displayOptions: {
		show: {
			resource: ['pipelines'],
			operation: ['getAll'],
		},
	},
};

export const pipelineSkip: INodeProperties = {
	displayName: 'Pular (Skip)',
	name: 'skip',
	type: 'number',
	default: 0,
	description: 'Número de pipelines a serem pulados',
	displayOptions: {
		show: {
			resource: ['pipelines'],
			operation: ['getAll'],
		},
	},
};

export const pipelineSearch: INodeProperties = {
	displayName: 'Pesquisar',
	name: 'search',
	type: 'string',
	default: '',
	placeholder: 'Digite o termo de busca',
	description: 'Termo para buscar pipelines por nome ou descrição',
	displayOptions: {
		show: {
			resource: ['pipelines'],
			operation: ['getAll'],
		},
	},
};

export const pipelineId: INodeProperties = {
	displayName: 'Pipeline ID',
	name: 'pipelineId',
	type: 'string',
	required: true,
	default: '',
	placeholder: 'Digite o ID do pipeline',
	description: 'ID do pipeline para listar os estágios',
	displayOptions: {
		show: {
			resource: ['pipelines'],
			operation: ['getStages'],
		},
	},
};