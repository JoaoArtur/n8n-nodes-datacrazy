import { IExecuteFunctions } from 'n8n-workflow';
import { request } from '../../GenericFunctions';
import { IConversationQueryParams, ISendMessageOptions } from './conversations.types';

// Conversation-specific API functions
export async function getAllConversations(
	context: IExecuteFunctions,
	queryParams?: IConversationQueryParams,
): Promise<any> {
	return await request(context, 'GET', '/conversations', undefined, queryParams);
}

export async function getConversationById(
	context: IExecuteFunctions,
	conversationId: string,
): Promise<any> {
	return await request(context, 'GET', `/conversations/${conversationId}/messages`);
}

export async function sendMessage(
	context: IExecuteFunctions,
	conversationId: string,
	messageData: ISendMessageOptions,
): Promise<any> {
	return await request(context, 'POST', `/conversations/${conversationId}/messages`, messageData);
}

export async function finishConversation(
	context: IExecuteFunctions,
	conversationId: string,
): Promise<any> {
	const messagingBaseUrl = 'https://messaging.g1.datacrazy.io/api/messaging';
	return await request(context, 'POST', `/conversations/${conversationId}/finish`, undefined, undefined, messagingBaseUrl);
}

export function buildConversationQueryParams(options: any): any {
	console.log('🔍 [DEBUG] buildConversationQueryParams - Recebido options:', JSON.stringify(options, null, 2));

	const queryParams: any = {};

	// Extrair skip, take, search, pipeline, stages e filters do objeto options
	const { skip, take, search, pipeline, stages, filters } = options;

	console.log('🔍 [DEBUG] Campos extraídos:', {
		skip,
		take,
		search,
		pipeline,
		stages,
		filters: filters ? `Array com ${filters.length} itens` : 'undefined'
	});

	// Adicionar skip se fornecido
	if (skip !== undefined && skip !== null) {
		queryParams.skip = skip;
		console.log('✅ [DEBUG] Adicionado skip:', skip);
	}

	// Adicionar take se fornecido
	if (take !== undefined && take !== null) {
		queryParams.take = take;
		console.log('✅ [DEBUG] Adicionado take:', take);
	}

	// Adicionar search se fornecido
	if (search !== undefined && search !== null && search !== '') {
		queryParams.search = search;
		console.log('✅ [DEBUG] Adicionado search:', search);
	}

	// Processar pipeline como filtro se fornecido
	if (pipeline !== undefined && pipeline !== null && pipeline !== '') {
		queryParams['filter[pipeline]'] = pipeline;
		console.log('✅ [DEBUG] Adicionado filter[pipeline]:', pipeline);
	}

	// Processar stages como filtro se fornecido
	if (stages !== undefined && stages !== null && stages !== '') {
		queryParams['filter[stages]'] = stages;
		console.log('✅ [DEBUG] Adicionado filter[stages]:', stages);
	}

	// Processar filtros avançados se fornecidos
	if (filters && Array.isArray(filters) && filters.length > 0) {
		console.log('🔍 [DEBUG] Processando filtros avançados:', filters);
		filters.forEach((filterObject: any, index: number) => {
			console.log(`🔍 [DEBUG] Processando objeto de filtro ${index}:`, filterObject);

			// O n8n envia os filtros como um objeto onde cada propriedade é um campo de filtro
			// Em vez de { field: "tags", value: [...] }, recebemos { tags: [...], initialized: true, ... }
			Object.keys(filterObject).forEach((fieldName: string) => {
				const fieldValue = filterObject[fieldName];
				console.log(`🔍 [DEBUG] Processando campo: ${fieldName} = ${fieldValue}`);

				if (fieldValue !== undefined && fieldValue !== null && fieldValue !== '') {
					// Mapear campos para os nomes corretos da API
					const fieldMap: { [key: string]: string } = {
						initialized: 'initialized',
						department: 'department',
						instanceId: 'instanceId',
						tags: 'tags',
						attendant: 'attendant',
					};

					const apiField = fieldMap[fieldName] || fieldName;
					console.log(`🔍 [DEBUG] Campo mapeado: ${fieldName} -> ${apiField}`);

					// Processar valores baseado no tipo de campo
					if (Array.isArray(fieldValue)) {
						// Para arrays (tags, instanceId), juntar com vírgula
						const joinedValue = fieldValue.join(',');
						queryParams[`filter[${apiField}]`] = joinedValue;
						console.log(`✅ [DEBUG] Adicionado filter[${apiField}] (array):`, joinedValue);
					} else {
						queryParams[`filter[${apiField}]`] = fieldValue;
						console.log(`✅ [DEBUG] Adicionado filter[${apiField}]:`, fieldValue);
					}
				} else {
					console.log(`⚠️ [DEBUG] Campo ${fieldName} ignorado - valor inválido:`, fieldValue);
				}
			});
		});
	} else {
		console.log('ℹ️ [DEBUG] Nenhum filtro avançado fornecido');
	}

	console.log('🎯 [DEBUG] queryParams final:', JSON.stringify(queryParams, null, 2));
	return queryParams;
}

// Helper function to build message data from node parameters
export function buildMessageData(parameters: any, context?: IExecuteFunctions): ISendMessageOptions {
	const messageType = parameters.messageType || 'TEXT';

	// Para mensagens de texto
	if (messageType === 'TEXT') {
		const messageData: ISendMessageOptions = {
			body: parameters.body,
			isInternal: false,
		};

		// Add additional fields if provided
		if (parameters.additionalFields) {
			const additional = parameters.additionalFields;

			if (additional.repliedMessageId) {
				messageData.repliedMessageId = additional.repliedMessageId;
			}

			if (additional.scheduledDate) {
				messageData.scheduledDate = formatDateToISO(additional.scheduledDate, context);
			}

			if (additional.isInternal !== undefined) {
				messageData.isInternal = additional.isInternal;
			}
		}

		return messageData;
	} else {
		// Para mensagens de mídia, seguir formato específico com attachments
		if (parameters.attachmentUrl) {
			const attachment: any = {
				file: {},
				fileName: parameters.fileName || `file.${getFileExtensionByType(messageType)}`,
				mimeType: parameters.mimeType || getMimeTypeByType(messageType),
				type: messageType,
				url: parameters.attachmentUrl,
				size: parameters.fileSize || 0
			};

			// Criar payload com attachments e isInternal
			const mediaMessage: ISendMessageOptions = {
				attachments: [attachment],
				isInternal: false
			};

			// Adicionar body se fornecido (opcional para mensagens de mídia)
			if (parameters.body && parameters.body.trim()) {
				mediaMessage.body = parameters.body;
			}

			// Adicionar campos adicionais se presentes
			if (parameters.additionalFields) {
				const additional = parameters.additionalFields;

				if (additional.scheduledDate) {
					mediaMessage.scheduledDate = formatDateToISO(additional.scheduledDate, context);
				}

				if (additional.repliedMessageId) {
					mediaMessage.repliedMessageId = additional.repliedMessageId;
				}

				if (additional.isInternal !== undefined) {
					mediaMessage.isInternal = additional.isInternal;
				}
			}

			return mediaMessage;
		}
	}

	// Fallback para casos não cobertos
	return {
		body: parameters.body || '',
		isInternal: false,
	};
}

// Função auxiliar para obter extensão de arquivo baseada no tipo
function getFileExtensionByType(type: string): string {
	switch (type) {
		case 'IMAGE': return 'png';
		case 'VIDEO': return 'mp4';
		case 'AUDIO': return 'ogg';
		case 'FILE': return 'pdf';
		default: return 'txt';
	}
}

// Função auxiliar para obter MIME type baseado no tipo
function getMimeTypeByType(type: string): string {
	switch (type) {
		case 'IMAGE': return 'image/png';
		case 'VIDEO': return 'video/mp4';
		case 'AUDIO': return 'audio/ogg; codecs=opus';
		case 'FILE': return 'application/pdf';
		default: return 'text/plain';
	}
}

// Função auxiliar para gerar ID único para attachment
function generateAttachmentId(): string {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		const r = Math.random() * 16 | 0;
		const v = c === 'x' ? r : (r & 0x3 | 0x8);
		return v.toString(16);
	});
}

// Função auxiliar para formatar data para ISO 8601 convertendo para UTC0
function formatDateToISO(dateValue: string, context?: IExecuteFunctions): string {
	// Se já está no formato ISO 8601 completo com Z (UTC), retorna como está
	if (dateValue.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/)) {
		return dateValue;
	}

	// Se está no formato ISO 8601 mas sem milissegundos, adiciona
	if (dateValue.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/)) {
		return dateValue.replace('Z', '.000Z');
	}

	// Se já tem timezone offset (+XX:XX ou -XX:XX), converte para UTC
	if (dateValue.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}[+-]\d{2}:\d{2}$/)) {
		const date = new Date(dateValue);
		return date.toISOString();
	}

	// Obter timezone do n8n (padrão: America/New_York conforme documentação)
	const n8nTimezone = 'America/Sao_Paulo';

	try {
		let dateInTimezone: string;

		// Se está no formato ISO 8601 mas sem timezone, trata como timezone local do n8n
		if (dateValue.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/)) {
			dateInTimezone = dateValue;
		}
		// Se está no formato YYYY-MM-DD HH:mm:ss, converte para ISO
		else if (dateValue.match(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/)) {
			dateInTimezone = dateValue.replace(' ', 'T');
		}
		// Se está no formato YYYY-MM-DD, adiciona horário
		else if (dateValue.match(/^\d{4}-\d{2}-\d{2}$/)) {
			dateInTimezone = dateValue + 'T00:00:00';
		}
		// Tenta interpretar outros formatos
		else {
			const date = new Date(dateValue);
			if (!isNaN(date.getTime())) {
				// Se conseguiu criar uma data válida, assume que já está em UTC
				return date.toISOString();
			}
			return dateValue; // Retorna original se não conseguir processar
		}

		// Converte a data do timezone local do n8n para UTC
		return convertTimezoneToUTC(dateInTimezone, n8nTimezone);

	} catch (error) {
		// Se não conseguir converter, retorna o valor original
		return dateValue;
	}
}

// Função auxiliar para converter data de um timezone específico para UTC
function convertTimezoneToUTC(dateString: string, timezone: string): string {
	try {
		// Cria uma data assumindo que está no timezone especificado
		// Usa uma abordagem mais confiável com Intl.DateTimeFormat
		const date = new Date(dateString);

		// Obter a data/hora no timezone especificado
		const formatter = new Intl.DateTimeFormat('en-CA', {
			timeZone: timezone,
			year: 'numeric',
			month: '2-digit',
			day: '2-digit',
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit',
			hour12: false
		});

		const parts = formatter.formatToParts(date);
		const tzDateString = `${parts.find(p => p.type === 'year')?.value}-${parts.find(p => p.type === 'month')?.value}-${parts.find(p => p.type === 'day')?.value}T${parts.find(p => p.type === 'hour')?.value}:${parts.find(p => p.type === 'minute')?.value}:${parts.find(p => p.type === 'second')?.value}`;

		// Calcula a diferença entre a data original e a data no timezone
		const originalTime = new Date(dateString).getTime();
		const timezoneTime = new Date(tzDateString).getTime();
		const offset = timezoneTime - originalTime;

		// Ajusta a data original subtraindo o offset para obter UTC
		const utcDate = new Date(originalTime - offset);
		return utcDate.toISOString();

	} catch (error) {
		// Fallback: tenta uma conversão mais simples
		try {
			// Assume que a data está no timezone especificado e converte para UTC
			const tempDate = new Date(dateString + (timezone === 'UTC' ? 'Z' : ''));
			return tempDate.toISOString();
		} catch (fallbackError) {
			// Se tudo falhar, retorna a data original
			return dateString;
		}
	}
}