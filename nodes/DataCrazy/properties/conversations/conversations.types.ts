// Conversation-specific interfaces and types

export interface IConversationMessage {
	id?: string;
	body: string;
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
	filter?: IConversationFilterOptions;
	[key: string]: any;
}

// Interface para envio de mensagens
export interface ISendMessageOptions {
	body: string;
	repliedMessageId?: string;
	scheduledDate?: string;
	isInternal?: boolean;
}

// Interface para resposta da API
export interface IConversationResponse {
	count: number;
	data: IConversation[];
}