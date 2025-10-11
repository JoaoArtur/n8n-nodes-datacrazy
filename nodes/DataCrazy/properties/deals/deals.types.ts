/**
 * Interfaces e tipos para operações de negócios (deals) no DataCrazy
 */

/**
 * Interface para um negócio (deal)
 */
export interface IDeal {
	id?: string;
	leadId: string;
	pipelineId?: string;
	stageId: string;
	attendantId: string;
	externalId?: string;
	createdAt?: string;
	updatedAt?: string;
	deletedAt?: string | null;
}

/**
 * Interface para opções de filtro de negócios
 */
export interface IBusinessFilterOptions {
	lossReason?: string;
	tags?: string;
	products?: string;
	attendants?: string[];
	fields?: string;
	status?: string;
	businessFields?: string;
	source?: string;
	minValue?: number;
	maxValue?: number;
	startDate?: string;
	endDate?: string;
	createdAtGreaterOrEqual?: string;
	createdAtLessOrEqual?: string;
	lastMovedAfter?: string;
	lastMovedBefore?: string;
}

/**
 * Interface para parâmetros de consulta de negócios
 */
export interface IDealQueryParams {
	skip?: number;
	take?: number;
	search?: string;
	filter?: IBusinessFilterOptions;
	filters?: any[]; // Para os novos filtros separados
}

/**
 * Interface para dados de criação de negócio
 */
export interface ICreateDealData {
	leadId: string;
	pipelineId?: string;
	stageId: string;
	attendantId: string;
	externalId?: string;
}

/**
 * Interface para dados de atualização de negócio
 */
export interface IUpdateDealData {
	leadId?: string;
	pipelineId?: string;
	stageId?: string;
	attendantId?: string;
	externalId?: string;
}

/**
 * Interface para resposta da API de negócios
 */
export interface IDealsResponse {
	data: IDeal[];
	total?: number;
	page?: number;
	limit?: number;
}

/**
 * Interface para resposta de um único negócio
 */
export interface IDealResponse {
	data: IDeal;
}