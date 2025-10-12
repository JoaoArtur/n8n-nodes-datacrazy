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

// Helper function to build conversation query parameters
export function buildConversationQueryParams(options: any): any {
	const queryParams: any = {};

	// Basic pagination and search
	if (options.skip !== undefined) queryParams.skip = options.skip;
	if (options.take !== undefined) queryParams.take = options.take;
	if (options.search) queryParams.search = options.search;

	// Advanced filters
	if (options.filters && Array.isArray(options.filters)) {
		const filter: any = {};

		options.filters.forEach((filterItem: any) => {
			// Conversas inicializadas
			if (filterItem.initialized !== undefined) {
				filter.initialized = filterItem.initialized;
			}

			// Departamento
			if (filterItem.department) {
				filter.department = filterItem.department;
			}

			// Instâncias (pode ser um ID único ou lista separada por vírgula)
			if (filterItem.instanceId) {
				filter.instanceId = filterItem.instanceId;
			}

			// Tags (pode ser um ID único ou lista separada por vírgula)
			if (filterItem.tags) {
				filter.tags = filterItem.tags;
			}

			// Estágios
			if (filterItem.stages) {
				filter.stages = filterItem.stages;
			}

			// Atendente
			if (filterItem.attendant) {
				filter.attendant = filterItem.attendant;
			}
		});

		// Só adiciona o filtro se houver pelo menos uma propriedade
		if (Object.keys(filter).length > 0) {
			queryParams.filter = filter;
		}
	}

	return queryParams;
}

// Helper function to build message data from node parameters
export function buildMessageData(parameters: any): ISendMessageOptions {
	const messageData: ISendMessageOptions = {
		body: parameters.body,
	};

	// Add additional fields if provided
	if (parameters.additionalFields) {
		const additional = parameters.additionalFields;
		
		if (additional.repliedMessageId) {
			messageData.repliedMessageId = additional.repliedMessageId;
		}
		
		if (additional.scheduledDate) {
			// Garantir que a data está no formato ISO 8601
			messageData.scheduledDate = formatDateToISO(additional.scheduledDate);
		}
		
		if (additional.isInternal !== undefined) {
			messageData.isInternal = additional.isInternal;
		}
	}

	return messageData;
}

// Função auxiliar para formatar data para ISO 8601
function formatDateToISO(dateValue: string): string {
	// Se já está no formato ISO 8601 completo, retorna como está
	if (dateValue.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/)) {
		return dateValue;
	}
	
	// Se está no formato ISO 8601 mas sem milissegundos, adiciona
	if (dateValue.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/)) {
		return dateValue.replace('Z', '.000Z');
	}
	
	// Se está no formato ISO 8601 mas sem timezone, adiciona
	if (dateValue.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/)) {
		return dateValue + '.000Z';
	}
	
	// Se está no formato YYYY-MM-DD HH:mm:ss, converte para ISO 8601
	if (dateValue.match(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/)) {
		return dateValue.replace(' ', 'T') + '.000Z';
	}
	
	// Se está no formato YYYY-MM-DD, adiciona horário
	if (dateValue.match(/^\d{4}-\d{2}-\d{2}$/)) {
		return dateValue + 'T00:00:00.000Z';
	}
	
	// Tenta criar uma data válida e converter para ISO
	try {
		const date = new Date(dateValue);
		if (!isNaN(date.getTime())) {
			return date.toISOString();
		}
	} catch (error) {
		// Se não conseguir converter, retorna o valor original
	}
	
	return dateValue;
}