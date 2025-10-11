import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';

import { dataCrazyNodeProperties } from './properties';
import {
	getAllLeads,
	createLead,
	getLeadById,
	updateLead,
	deleteLead,
	buildLeadData,
	buildLeadQueryParams,
	getLeadActivities,
	getLeadHistory,
	getLeadBusinesses,
} from './properties/leads';
import {
	getAllDeals,
	createDeal,
	getDealById,
	updateDeal,
	deleteDeal,
	buildDealData,
	buildDealQueryParams,
} from './properties/deals';
import {
	getLeadAttachments,
	createLeadAttachment,
	deleteLeadAttachment,
	buildAttachmentData,
} from './properties/attachments';
import {
	getLeadNotes,
	createLeadNote,
	updateLeadNote,
	deleteLeadNote,
	buildNoteData,
} from './properties/annotations';
import {
	getAllTags,
	createTag,
	getTagById,
	updateTag,
	deleteTag,
	buildTagData,
} from './properties/tags';

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

						case 'getActivities':
							const activitiesLeadId = this.getNodeParameter('leadId', i) as string;
							responseData = await getLeadActivities(this, activitiesLeadId);
							break;

						case 'getHistory':
							const historyLeadId = this.getNodeParameter('leadId', i) as string;
							responseData = await getLeadHistory(this, historyLeadId);
							break;

						case 'getBusinesses':
							const businessesLeadId = this.getNodeParameter('leadId', i) as string;
							responseData = await getLeadBusinesses(this, businessesLeadId);
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
				} else if (resource === 'attachments') {
					const leadId = this.getNodeParameter('leadId', i) as string;
					
					switch (operation) {
						case 'getAll':
							responseData = await getLeadAttachments(this, leadId);
							break;

						case 'create':
							const attachmentData = buildAttachmentData({
								attachmentUrl: this.getNodeParameter('attachmentUrl', i) as string,
								fileName: this.getNodeParameter('fileName', i) as string,
								fileSize: this.getNodeParameter('fileSize', i) as string,
								description: this.getNodeParameter('description', i, '') as string,
							});
							responseData = await createLeadAttachment(this, leadId, attachmentData);
							break;

						case 'delete':
							const attachmentId = this.getNodeParameter('attachmentId', i) as string;
							responseData = await deleteLeadAttachment(this, leadId, attachmentId);
							break;

						default:
							throw new NodeOperationError(
								this.getNode(),
								`Operação "${operation}" não é suportada para o recurso "${resource}"`,
							);
					}
				} else if (resource === 'annotations') {
					const leadId = this.getNodeParameter('leadId', i) as string;
					
					switch (operation) {
						case 'getAll':
							responseData = await getLeadNotes(this, leadId);
							break;

						case 'create':
							const noteData = buildNoteData({
								note: this.getNodeParameter('note', i) as string,
							});
							responseData = await createLeadNote(this, leadId, noteData);
							break;

						case 'update':
							const noteId = this.getNodeParameter('noteId', i) as string;
							const updateNoteData = buildNoteData({
								note: this.getNodeParameter('note', i) as string,
							});
							responseData = await updateLeadNote(this, leadId, noteId, updateNoteData);
							break;

						case 'delete':
							const deleteNoteId = this.getNodeParameter('noteId', i) as string;
							responseData = await deleteLeadNote(this, leadId, deleteNoteId);
							break;

						default:
							throw new NodeOperationError(
								this.getNode(),
								`Operação "${operation}" não é suportada para o recurso "${resource}"`,
							);
					}
				} else if (resource === 'tags') {
					switch (operation) {
						case 'getAll':
							responseData = await getAllTags.call(this);
							break;

						case 'create':
							const createTagData = buildTagData({
								name: this.getNodeParameter('name', i) as string,
								color: this.getNodeParameter('color', i) as string,
								...this.getNodeParameter('additionalFields', i) as object,
							}) as any;
							responseData = await createTag.call(this, createTagData);
							break;

						case 'get':
							const tagId = this.getNodeParameter('tagId', i) as string;
							responseData = await getTagById.call(this, tagId);
							break;

						case 'update':
							const updateTagId = this.getNodeParameter('tagId', i) as string;
							const updateTagData = buildTagData({
								...this.getNodeParameter('additionalFields', i) as object,
							});
							responseData = await updateTag.call(this, updateTagId, updateTagData);
							break;

						case 'delete':
							const deleteTagId = this.getNodeParameter('tagId', i) as string;
							responseData = await deleteTag.call(this, deleteTagId);
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
