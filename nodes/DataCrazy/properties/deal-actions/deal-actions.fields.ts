import { INodeProperties } from 'n8n-workflow';

// Campo para IDs dos negócios (usado em todas as operações)
export const dealIds: INodeProperties = {
	displayName: 'IDs dos Negócios',
	name: 'ids',
	type: 'string',
	required: true,
	default: '',
	placeholder: 'ID1,ID2,ID3 ou ["ID1","ID2","ID3"]',
	description: 'IDs dos negócios separados por vírgula ou array JSON',
	displayOptions: {
		show: {
			resource: ['dealActions'],
			operation: ['move', 'win', 'lose', 'restore'],
		},
	},
};

// Campo para seleção de pipeline (operação move)
export const destinationPipelineId: INodeProperties = {
	displayName: 'Pipeline de Destino',
	name: 'destinationPipelineId',
	type: 'options',
	typeOptions: {
		loadOptionsMethod: 'getPipelines',
	},
	required: true,
	default: '',
	description: 'Selecione o pipeline de destino',
	displayOptions: {
		show: {
			resource: ['dealActions'],
			operation: ['move'],
		},
	},
};

// Campo para seleção de estágio (operação move)
export const destinationStageId: INodeProperties = {
	displayName: 'Estágio de Destino',
	name: 'destinationStageId',
	type: 'options',
	typeOptions: {
		loadOptionsMethod: 'getStages',
		loadOptionsDependsOn: ['destinationPipelineId'],
	},
	required: true,
	default: '',
	description: 'Selecione o estágio de destino',
	displayOptions: {
		show: {
			resource: ['dealActions'],
			operation: ['move'],
		},
	},
};

// Campo para seleção de motivo de perda (operação lose)
export const lossReasonId: INodeProperties = {
	displayName: 'Motivo da Perda',
	name: 'lossReasonId',
	type: 'options',
	typeOptions: {
		loadOptionsMethod: 'getLossReasons',
	},
	required: true,
	default: '',
	description: 'Selecione o motivo pelo qual os negócios foram perdidos',
	displayOptions: {
		show: {
			resource: ['dealActions'],
			operation: ['lose'],
		},
	},
};

// Campo para justificativa da perda (operação lose)
export const justification: INodeProperties = {
	displayName: 'Justificativa',
	name: 'justification',
	type: 'string',
	required: true,
	default: '',
	placeholder: 'Lead desistiu do negócio',
	description: 'Justificativa para a perda dos negócios',
	displayOptions: {
		show: {
			resource: ['dealActions'],
			operation: ['lose'],
		},
	},
};

// Coleção de campos adicionais para operações específicas
export const additionalFields: INodeProperties = {
	displayName: 'Campos Adicionais',
	name: 'additionalFields',
	type: 'collection',
	placeholder: 'Adicionar Campo',
	default: {},
	displayOptions: {
		show: {
			resource: ['dealActions'],
		},
	},
	options: [
		{
			displayName: 'Observações',
			name: 'notes',
			type: 'string',
			default: '',
			description: 'Observações adicionais sobre a ação',
		},
		{
			displayName: 'Notificar Usuários',
			name: 'notifyUsers',
			type: 'boolean',
			default: false,
			description: 'Se deve notificar os usuários sobre a ação',
		},
	],
};