import { INodeProperties } from 'n8n-workflow';

export const attendantsFields: INodeProperties[] = [
	// Campo Atendente (CRM) - usado para getCrm
	{
		displayName: 'Atendente',
		name: 'attendantId',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getAttendants',
		},
		required: true,
		displayOptions: {
			show: {
				resource: ['attendants'],
				operation: ['getCrm'],
			},
		},
		default: '',
		description: 'Selecione o atendente do CRM',
	},

	// Campo ID do Atendente (Multi) - usado para getMulti
	{
		displayName: 'ID do Atendente',
		name: 'attendantMultiId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['attendants'],
				operation: ['getMulti'],
			},
		},
		default: '',
		description: 'ID único do atendente do Multi',
	},

	// Campo Busca - usado para getAllMulti
	{
		displayName: 'Busca',
		name: 'attendantMultiSearch',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['attendants'],
				operation: ['getAllMulti'],
			},
		},
		default: '',
		description: 'Termo para filtrar os atendentes (opcional)',
	},
];
