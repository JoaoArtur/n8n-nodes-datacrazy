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

// Campo para ID do estágio de destino (operação move)
export const destinationStageId: INodeProperties = {
	displayName: 'ID do Estágio de Destino',
	name: 'destinationStageId',
	type: 'string',
	required: true,
	default: '',
	placeholder: '8c2f62ea-0397-4cd7-92e0-5d4268d407ea',
	description: 'ID do estágio para onde os negócios serão movidos',
	displayOptions: {
		show: {
			resource: ['dealActions'],
			operation: ['move'],
		},
	},
};

// Campo para ID do motivo da perda (operação lose)
export const lossReasonId: INodeProperties = {
	displayName: 'ID do Motivo da Perda',
	name: 'lossReasonId',
	type: 'string',
	required: true,
	default: '',
	placeholder: '59e77f5f-7581-4f20-a05b-97cd33485019',
	description: 'ID do motivo pelo qual os negócios foram perdidos',
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