// Conversation-specific interfaces and types

// Tipos de mensagem suportados
export type MessageType = 'TEXT' | 'IMAGE' | 'VIDEO' | 'AUDIO' | 'FILE';

// Interface para anexos de mensagem
export interface IMessageAttachment {
	url: string;
	type: MessageType;
	fileName: string;
	mimeType: string;
	size?: number;
	file?: any;
	id?: string;
}

// Interface para compressão de arquivo
export interface IFileCompression {
	compressing: boolean;
	progress: number;
}

export interface IConversationMessage {
	id?: string;
	body?: string;
	attachments?: IMessageAttachment[];
	pendings?: any[];
	fileCompression?: IFileCompression;
	repliedMessageId?: string;
	scheduledDate?: string;
	isInternal?: boolean;
	createdAt?: string;
	updatedAt?: string;
}

export interface IConversationParticipant {
	id?: string;
	name?: string;
	phone?: string;
	email?: string;
}

export interface IConversationDepartment {
	id: string;
	name?: string;
}

export interface IConversationInstance {
	id: string;
	name?: string;
}

export interface IConversationTag {
	id: string;
	name?: string;
}

export interface IConversationStage {
	id: string;
	name?: string;
}

export interface IConversationAttendant {
	id: string;
	name?: string;
}

export interface IConversation {
	id?: string;
	initialized?: boolean;
	department?: IConversationDepartment;
	instanceId?: string;
	tags?: IConversationTag[];
	stage?: IConversationStage;
	attendant?: IConversationAttendant;
	participant?: IConversationParticipant;
	messages?: IConversationMessage[];
	createdAt?: string;
	updatedAt?: string;
	lastMessageAt?: string;
}

// Interfaces para filtros avançados
export interface IConversationFilterOptions {
	initialized?: boolean;
	department?: string;
	instanceId?: string;
	tags?: string;
	stages?: string;
	attendant?: string;
}

export interface IConversationQueryParams {
	skip?: number;
	take?: number;
	search?: string;
	initialized?: boolean;
	department?: string;
	instanceId?: string | string[];
	tags?: string | string[];
	stages?: string;
	attendant?: string;
}

// Interface para opções de envio de mensagem
export interface ISendMessageOptions {
	messageType?: MessageType;
	body?: string;
	attachments?: IMessageAttachment[];
	pendings?: any[];
	fileCompression?: IFileCompression;
	attachmentUrl?: string;
	fileName?: string;
	mimeType?: string;
	fileSize?: number;
	repliedMessageId?: string;
	scheduledDate?: string;
	isInternal?: boolean;
}

// Interface para resposta da API
export interface IConversationResponse {
	count: number;
	data: IConversation[];
}