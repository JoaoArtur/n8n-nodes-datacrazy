import { IExecuteFunctions } from 'n8n-workflow';
import { request } from '../../GenericFunctions';
import {
	IDealAttachment,
	IDealAttachmentCreate,
	IDealAttachmentsResponse,
} from './deal-attachments.types';

/**
 * Buscar todos os anexos de um negócio
 */
export async function getDealAttachments(
	this: IExecuteFunctions,
	dealId: string,
): Promise<IDealAttachmentsResponse> {
	const endpoint = `/business/${dealId}/attachments`;
	return await request(this, 'GET', endpoint);
}

/**
 * Anexar um arquivo ao negócio
 */
export async function createDealAttachment(
	this: IExecuteFunctions,
	dealId: string,
	attachmentData: IDealAttachmentCreate,
): Promise<IDealAttachment> {
	const endpoint = `/business/${dealId}/attachments`;
	return await request(this, 'POST', endpoint, attachmentData);
}

/**
 * Excluir anexos do negócio em lote
 */
export async function deleteDealAttachments(
	this: IExecuteFunctions,
	dealId: string,
	attachmentIds: string[],
): Promise<void> {
	const endpoint = `/business/${dealId}/attachments/batch`;
	return await request(this, 'DELETE', endpoint, attachmentIds);
}

/**
 * Função auxiliar para construir dados do anexo
 */
export function buildDealAttachmentData(data: any): IDealAttachmentCreate {
	const attachmentData: IDealAttachmentCreate = {
		attachmentUrl: data.attachmentUrl,
		fileName: data.fileName,
	};

	if (data.description !== undefined && data.description !== '') {
		attachmentData.description = data.description;
	}

	return attachmentData;
}

/**
 * Converte uma lista de IDs separados por vírgula em array
 */
export function parseDealAttachmentIds(ids: string): string[] {
	return ids
		.split(',')
		.map((id) => id.trim())
		.filter((id) => id !== '');
}
