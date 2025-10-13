/**
 * Interface para configuração da instância
 */
export interface IInstanceConfig {
	endAutomationInterval: number;
	endTypingInterval: number;
	evolutionApiUrl: string;
	evolutionInstanceId: string;
	evolutionInstanceToken: string;
	listenGroups: boolean;
	typeList: string;
	startAutomationInterval: number;
	startTypingInterval: number;
	typingInterval: boolean;
}

/**
 * Interface para representar uma instância
 */
export interface IInstance {
	id: string;
	name: string;
	config: IInstanceConfig;
	createdAt: string;
	updatedAt: string;
	platform: string;
	provider: string;
	engine: string;
	isActive: boolean;
	status: string;
	deletedAt: string | null;
	webhook: string;
}

/**
 * Interface para resposta da API de instâncias
 */
export interface IInstancesResponse {
	count: number;
	data: IInstance[];
}