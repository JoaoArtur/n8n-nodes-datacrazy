import {
	IExecuteFunctions,
	ILoadOptionsFunctions,
	INodeExecutionData,
	INodeListSearchResult,
	INodePropertyOptions,
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
	getTagsForLoadOptions,
} from './properties/tags';
import {
	getAllConversations,
	getConversationById,
	sendMessage,
	buildConversationQueryParams,
	buildMessageData,
} from './properties/conversations';
import {
	moveDealAction,
	winDealAction,
	loseDealAction,
	restoreDealAction,
	buildMoveActionData,
	buildWinActionData,
	buildLoseActionData,
	buildRestoreActionData,
} from './properties/deal-actions';
import {
	getAllPipelines,
	buildPipelineQueryParams,
	getPipelineStages,
	getPipelineStagesForLoadOptions,
} from './properties/pipelines';
import type { IStage } from './properties/pipelines/pipelines.types';
import { getBusinessLossReasonsForLoadOptions } from './properties/business-loss-reasons';
import type { IBusinessLossReason } from './properties/business-loss-reasons/business-loss-reasons.types';
import { getAttendantsForLoadOptions } from './properties/attendants-crm';
import { getInstancesForLoadOptions } from './properties/instances';
import { getDepartmentsForLoadOptions } from './properties/departments';

export class DataCrazy implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'DataCrazy',
		name: 'dataCrazy',
		icon: { light: 'file:logo.svg', dark: 'file:logo-white.svg' },
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
		usableAsTool: true,
		properties: dataCrazyNodeProperties,
	};

	methods = {
		loadOptions: {
			async getPipelines(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				try {
					// Criar parâmetros de query padrão para buscar todos os pipelines
					const queryParams = buildPipelineQueryParams(500, 0, '');

					// Chamar a função getAllPipelines usando IExecuteFunctions
					const executeFunctions = this as unknown as IExecuteFunctions;
					const response = await getAllPipelines.call(executeFunctions, queryParams);

					// Extrair os dados do response
					const pipelines = response.data || [];

					// Agrupar pipelines por grupo
					const groupedPipelines = pipelines.reduce(
						(groups: { [key: string]: any[] }, pipeline: any) => {
							const group = pipeline.group || 'Sem Grupo';
							if (!groups[group]) {
								groups[group] = [];
							}
							groups[group].push(pipeline);
							return groups;
						},
						{},
					);

					// Criar lista de opções com separadores visuais
					const options: INodePropertyOptions[] = [];

					// Ordenar grupos alfabeticamente
					const sortedGroups = Object.keys(groupedPipelines).sort();

					sortedGroups.forEach((groupName, groupIndex) => {
						// Adicionar separador visual para o grupo (exceto para o primeiro grupo)
						if (groupIndex > 0) {
							options.push({
								name: '────────────────────────',
								value: `separator_${groupIndex}`,
							});
						}

						// Adicionar cabeçalho do grupo
						options.push({
							name: `📁 ${groupName}`,
							value: `group_header_${groupName}`,
						});

						// Ordenar pipelines dentro do grupo alfabeticamente
						const sortedPipelines = groupedPipelines[groupName].sort((a: any, b: any) =>
							a.name.localeCompare(b.name),
						);

						// Adicionar pipelines do grupo
						sortedPipelines.forEach((pipeline: any) => {
							options.push({
								name: `  └─ ${pipeline.name}`,
								value: pipeline.id,
							});
						});
					});

					return options;
				} catch (error) {
					throw new NodeOperationError(
						this.getNode(),
						`Erro ao carregar pipelines: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
					);
				}
			},
			async getStages(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				try {
					// Obter o pipelineId dependendo do contexto:
					// - 'destinationPipelineId' para deal-actions
					// - 'pipelineId' para deals
					// - 'filters.pipeline' para filtros de conversas
					const pipelineId =
						(this.getCurrentNodeParameter('destinationPipelineId') as string) ||
						(this.getCurrentNodeParameter('pipelineId') as string) ||
						(this.getCurrentNodeParameter('filters.pipeline') as string) ||
						'';

					if (!pipelineId) {
						return [];
					}

					// Chamar a função getPipelineStagesForLoadOptions
					const stagesResponse = await getPipelineStagesForLoadOptions.call(this, pipelineId);

					// A API retorna um objeto IStagesResponse: { count: number, data: IStage[] }
					// Extrair o array de estágios da resposta
					let stages: IStage[] = [];

					// Verificar se a resposta tem a estrutura esperada
					if (stagesResponse && stagesResponse.data && Array.isArray(stagesResponse.data)) {
						stages = stagesResponse.data;
					} else {
						console.error('Estrutura inesperada da resposta de stages:', stagesResponse);
						return [];
					}

					// Mapear os estágios para o formato esperado pelo n8n
					const mappedStages = stages.map((stage: IStage) => ({
						name: stage.name,
						value: stage.id,
					}));

					return mappedStages;
				} catch (error) {
					console.error('Erro ao carregar estágios:', error);
					throw new NodeOperationError(
						this.getNode(),
						`Erro ao carregar estágios: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
					);
				}
			},
			async getLossReasons(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				try {
					// Chamar a função getBusinessLossReasonsForLoadOptions
					const lossReasonsResponse = await getBusinessLossReasonsForLoadOptions.call(this);

					// A resposta da API retorna diretamente um objeto com 'count' e 'data'
					// Extrair o array de motivos de perda da resposta
					let lossReasons: IBusinessLossReason[] = [];

					// Verificar se a resposta tem a estrutura esperada
					if (
						lossReasonsResponse &&
						lossReasonsResponse.data &&
						Array.isArray(lossReasonsResponse.data)
					) {
						lossReasons = lossReasonsResponse.data;
					} else if (lossReasonsResponse && Array.isArray(lossReasonsResponse)) {
						// Caso a resposta seja diretamente um array (fallback)
						lossReasons = lossReasonsResponse;
					} else {
						// Log para debug - remover em produção
						console.log(
							'Estrutura inesperada da resposta de motivos de perda:',
							JSON.stringify(lossReasonsResponse, null, 2),
						);
						return [];
					}

					// Mapear os motivos de perda para o formato esperado pelo n8n
					return lossReasons.map((reason: IBusinessLossReason) => ({
						name: reason.name,
						value: reason.id,
					}));
				} catch (error) {
					// Log para debug - remover em produção
					console.error('Erro ao carregar motivos de perda:', error);
					throw new NodeOperationError(
						this.getNode(),
						`Erro ao carregar motivos de perda: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
					);
				}
			},
			async getTags(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				try {
					// Chamar a função getTagsForLoadOptions
					const tagsResponse = await getTagsForLoadOptions.call(this);

					// A resposta da API retorna um objeto com 'data' contendo o array de tags
					let tags: any[] = [];

					// Verificar se a resposta tem a estrutura esperada
					if (tagsResponse && tagsResponse.data && Array.isArray(tagsResponse.data)) {
						tags = tagsResponse.data;
					} else if (tagsResponse && Array.isArray(tagsResponse)) {
						// Caso a resposta seja diretamente um array (fallback)
						tags = tagsResponse;
					} else {
						console.error('Estrutura inesperada da resposta de tags:', tagsResponse);
						return [];
					}

					// Mapear as tags para o formato esperado pelo n8n
					return tags.map((tag: any) => ({
						name: tag.name,
						value: tag.id,
					}));
				} catch (error) {
					console.error('Erro ao carregar tags:', error);
					throw new NodeOperationError(
						this.getNode(),
						`Erro ao carregar tags: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
					);
				}
			},
			async getAttendants(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				try {
					// Chamar a função getAttendantsForLoadOptions
					const attendantsResponse = await getAttendantsForLoadOptions(this);

					// A função já retorna no formato correto para n8n
					return attendantsResponse;
				} catch (error) {
					console.error('Erro ao carregar atendentes:', error);
					throw new NodeOperationError(
						this.getNode(),
						`Erro ao carregar atendentes: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
					);
				}
			},
			async getInstances(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				try {
					const instancesResponse = await getInstancesForLoadOptions(this);
					return instancesResponse;
				} catch (error) {
					console.error('Erro ao carregar instâncias:', error);
					throw new NodeOperationError(
						this.getNode(),
						`Erro ao carregar instâncias: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
					);
				}
			},
			async getDepartments(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				try {
					const departmentsResponse = await getDepartmentsForLoadOptions.call(this);
					return departmentsResponse;
				} catch (error) {
					console.error('Erro ao carregar departamentos:', error);
					throw new NodeOperationError(
						this.getNode(),
						`Erro ao carregar departamentos: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
					);
				}
			},
		},
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
								pipelineId: this.getNodeParameter('pipelineId', i) as string,
								stageId: this.getNodeParameter('stageId', i) as string,
								attendantId: this.getNodeParameter('attendantId', i) as string,
								...(this.getNodeParameter('additionalFields', i, {}) as any),
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
								pipelineId: this.getNodeParameter('pipelineId', i) as string,
								stageId: this.getNodeParameter('stageId', i) as string,
								attendantId: this.getNodeParameter('attendantId', i) as string,
								...(this.getNodeParameter('additionalFields', i, {}) as any),
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
								fileSize: this.getNodeParameter('fileSize', i) as number,
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
				} else if (resource === 'dealActions') {
					switch (operation) {
						case 'move':
							const idsString = this.getNodeParameter('ids', i) as string;
							const ids = idsString.includes('[')
								? JSON.parse(idsString)
								: idsString.split(',').map((id) => id.trim());
							const moveActionData = buildMoveActionData({
								ids,
								destinationPipelineId: this.getNodeParameter('destinationPipelineId', i) as string,
								destinationStageId: this.getNodeParameter('destinationStageId', i) as string,
								...(this.getNodeParameter('additionalFields', i) as object),
							});
							responseData = await moveDealAction.call(this, moveActionData);
							break;

						case 'win':
							const winIdsString = this.getNodeParameter('ids', i) as string;
							const winIds = winIdsString.includes('[')
								? JSON.parse(winIdsString)
								: winIdsString.split(',').map((id) => id.trim());
							const winActionData = buildWinActionData({
								ids: winIds,
								...(this.getNodeParameter('additionalFields', i) as object),
							});
							responseData = await winDealAction.call(this, winActionData);
							break;

						case 'lose':
							const loseIdsString = this.getNodeParameter('ids', i) as string;
							const loseIds = loseIdsString.includes('[')
								? JSON.parse(loseIdsString)
								: loseIdsString.split(',').map((id) => id.trim());
							const loseActionData = buildLoseActionData({
								ids: loseIds,
								lossReasonId: this.getNodeParameter('lossReasonId', i) as string,
								justification: this.getNodeParameter('justification', i) as string,
								...(this.getNodeParameter('additionalFields', i) as object),
							});
							responseData = await loseDealAction.call(this, loseActionData);
							break;

						case 'restore':
							const restoreIdsString = this.getNodeParameter('ids', i) as string;
							const restoreIds = restoreIdsString.includes('[')
								? JSON.parse(restoreIdsString)
								: restoreIdsString.split(',').map((id) => id.trim());
							const restoreActionData = buildRestoreActionData({
								ids: restoreIds,
								...(this.getNodeParameter('additionalFields', i) as object),
							});
							responseData = await restoreDealAction.call(this, restoreActionData);
							break;

						default:
							throw new NodeOperationError(
								this.getNode(),
								`Operação "${operation}" não é suportada para o recurso "${resource}"`,
							);
					}
				} else if (resource === 'pipelines') {
					switch (operation) {
						case 'getAll':
							const take = this.getNodeParameter('limit', i, 500) as number;
							const skip = this.getNodeParameter('skip', i, 0) as number;
							const search = this.getNodeParameter('search', i, '') as string;

							const queryParams = buildPipelineQueryParams(take, skip, search || undefined);

							responseData = await getAllPipelines.call(this, queryParams);
							break;

						case 'getStages':
							const pipelineId = this.getNodeParameter('pipelineId', i) as string;
							responseData = await getPipelineStages.call(this, pipelineId);
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
								...(this.getNodeParameter('additionalFields', i) as object),
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
								...(this.getNodeParameter('additionalFields', i) as object),
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
				} else if (resource === 'conversations') {
					switch (operation) {
						case 'getAll':
							const rawOptions = this.getNodeParameter('options', i, {});
							console.log('🔍 [DEBUG] DataCrazy.node.ts - Raw options from n8n:', JSON.stringify(rawOptions, null, 2));
							
							// Verificar se pipeline e stages estão no nível correto
							const pipeline = this.getNodeParameter('options.pipeline', i, '');
							const stages = this.getNodeParameter('options.stages', i, '');
							console.log('🔍 [DEBUG] DataCrazy.node.ts - Pipeline direto:', pipeline);
							console.log('🔍 [DEBUG] DataCrazy.node.ts - Stages direto:', stages);
							
							const conversationQueryParams = buildConversationQueryParams(rawOptions);
							responseData = await getAllConversations(this, conversationQueryParams);
							break;

						case 'get':
							const conversationId = this.getNodeParameter('conversationId', i) as string;
							responseData = await getConversationById(this, conversationId);
							break;

						case 'sendMessage':
							const messageConversationId = this.getNodeParameter('conversationId', i) as string;
							const messageType = this.getNodeParameter('messageType', i, 'TEXT') as string;
							
							// Construir parâmetros base
							const messageParams: any = {
								messageType,
								additionalFields: this.getNodeParameter('additionalFields', i, {}) as any,
							};
							
							// Adicionar parâmetros específicos baseados no tipo de mensagem
							if (messageType === 'TEXT') {
								messageParams.body = this.getNodeParameter('body', i) as string;
							} else {
								// Para mensagens de mídia
								messageParams.attachmentUrl = this.getNodeParameter('attachmentUrl', i) as string;
								messageParams.fileName = this.getNodeParameter('fileName', i) as string;
								messageParams.fileSize = this.getNodeParameter('fileSize', i) as number;
								
								// Adicionar mimeType se fornecido, senão será determinado automaticamente
								try {
									messageParams.mimeType = this.getNodeParameter('mimeType', i) as string;
								} catch {
									// mimeType será determinado automaticamente pela função
								}
								
								// Adicionar body opcional para mensagens de mídia
								try {
									const optionalBody = this.getNodeParameter('body', i) as string;
									if (optionalBody) {
										messageParams.body = optionalBody;
									}
								} catch {
									// body é opcional para mensagens de mídia
								}
							}
							
							const messageData = buildMessageData(messageParams, this);
							responseData = await sendMessage(this, messageConversationId, messageData);
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
