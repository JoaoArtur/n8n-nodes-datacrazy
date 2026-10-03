/**
 * Interfaces e tipos para o módulo de Anexos de Negócio do DataCrazy
 */

export interface IDealAttachment {
	id: string;
	createdAt: string;
	updatedAt: string;
	deletedAt: string | null;
	fileName: string;
	mimeType: string;
	url: string;
	type: string;
}

export interface IDealAttachmentCreate {
	attachmentUrl: string;
	fileName: string;
	fileSize: number;
	description?: string;
}

export interface IDealAttachmentsResponse {
	count: number;
	data: IDealAttachment[];
}
