import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';

import { dataCrazyNodeProperties } from '.';
import {
	getAllLeads,
	createLead,
	getLeadById,
	updateLead,
	deleteLead,
	buildLeadData,
	buildLeadQueryParams,
} from './leads';
import {
	getAllDeals,
	createDeal,
	getDealById,
	updateDeal,
	deleteDeal,
	buildDealData,
	buildDealQueryParams,
} from './deals';

export class DataCrazy implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'DataCrazy',
		name: 'dataCrazy',
		icon: 'file:datacrazy.svg',
		group: ['transform'],
		version: 1,
		description: 'Interagir com DataCrazy API para gerenciamento de leads, negócios e CRM',
		defaults: {
			name: 'DataCrazy',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'dataCrazyCredentials',
				required: true,
			},
		],
		properties: dataCrazyNodeProperties,
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			try {
				const resource = this.getNodeParameter('resource', i) as string;
				const operation = this.getNodeParameter('operation', i) as string;

				let responseData: any;

				if (resource === 'leads') {
					switch (operation) {
						case 'getAll':
							const queryParams = buildLeadQueryParams(this.getNodeParameter('options', i, {}));
							responseData = await getAllLeads(this, queryParams);
							break;

						case 'create':
							const createData = buildLeadData({
								name: this.getNodeParameter('name', i) as string,
								email: this.getNodeParameter('email', i, '') as string,
								phone: this.getNodeParameter('phone', i, '') as string,
								company: this.getNodeParameter('company', i, '') as string,
								source: this.getNodeParameter('source', i, '') as string,
								additionalFields: this.getNodeParameter('additionalFields', i, {}) as any,
							});
							responseData = await createLead(this, createData);
							break;

						case 'get':
							const leadId = this.getNodeParameter('leadId', i) as string;
							responseData = await getLeadById(this, leadId);
							break;

						case 'update':
							const updateLeadId = this.getNodeParameter('leadId', i) as string;
							const updateData = buildLeadData({
								name: this.getNodeParameter('name', i) as string,
								email: this.getNodeParameter('email', i, '') as string,
								phone: this.getNodeParameter('phone', i, '') as string,
								company: this.getNodeParameter('company', i, '') as string,
								source: this.getNodeParameter('source', i, '') as string,
								additionalFields: this.getNodeParameter('additionalFields', i, {}) as any,
							});
							responseData = await updateLead(this, updateLeadId, updateData);
							break;

						case 'delete':
							const deleteLeadId = this.getNodeParameter('leadId', i) as string;
							responseData = await deleteLead(this, deleteLeadId);
							break;

						default:
							throw new NodeOperationError(
								this.getNode(),
								`Operação "${operation}" não é suportada para o recurso "${resource}"`,
							);
					}
				} else if (resource === 'deals') {
					switch (operation) {
						case 'getAll':
							const dealQueryParams = buildDealQueryParams(this.getNodeParameter('options', i, {}));
							responseData = await getAllDeals.call(this, dealQueryParams);
							break;

						case 'create':
							const createDealData = buildDealData({
								leadId: this.getNodeParameter('leadId', i) as string,
								stageId: this.getNodeParameter('stageId', i) as string,
								attendantId: this.getNodeParameter('attendantId', i) as string,
								...this.getNodeParameter('additionalFields', i, {}) as any,
							});
							responseData = await createDeal.call(this, createDealData);
							break;

						case 'get':
							const dealId = this.getNodeParameter('dealId', i) as string;
							responseData = await getDealById.call(this, dealId);
							break;

						case 'update':
							const updateDealId = this.getNodeParameter('dealId', i) as string;
							const updateDealData = buildDealData({
								leadId: this.getNodeParameter('leadId', i) as string,
								stageId: this.getNodeParameter('stageId', i) as string,
								attendantId: this.getNodeParameter('attendantId', i) as string,
								...this.getNodeParameter('additionalFields', i, {}) as any,
							});
							responseData = await updateDeal.call(this, updateDealId, updateDealData);
							break;

						case 'delete':
							const deleteDealId = this.getNodeParameter('dealId', i) as string;
							responseData = await deleteDeal.call(this, deleteDealId);
							break;

						default:
							throw new NodeOperationError(
								this.getNode(),
								`Operação "${operation}" não é suportada para o recurso "${resource}"`,
							);
					}
				} else {
					throw new NodeOperationError(this.getNode(), `Recurso "${resource}" não é suportado`);
				}

				// Handle response data
				if (Array.isArray(responseData)) {
					responseData.forEach((item: any) => {
						returnData.push({
							json: item,
							pairedItem: { item: i },
						});
					});
				} else {
					returnData.push({
						json: responseData || {},
						pairedItem: { item: i },
					});
				}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: {
							error: error instanceof Error ? error.message : 'Unknown error occurred',
						},
						pairedItem: { item: i },
					});
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}
