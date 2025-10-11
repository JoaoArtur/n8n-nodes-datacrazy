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
	displayName: 'Pipeline',
	name: 'pipelineId',
	type: 'options',
	typeOptions: {
		loadOptionsMethod: 'getPipelines',
	},
	required: true,
	displayOptions: {
		show: {
			operation: ['getStages'],
		},
	},
	default: '',
	description: 'Selecione o pipeline para listar os estágios',
};