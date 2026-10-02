import { INodeProperties } from 'n8n-workflow';

export const instancesFields: INodeProperties[] = [
	// Campo Conexão - usado para get
	{
		displayName: 'Conexão',
		name: 'instanceId',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getInstances',
		},
		required: true,
		displayOptions: {
			show: {
				resource: ['instances'],
				operation: ['get'],
			},
		},
		default: '',
		description: 'Selecione a conexão',
	},
];
