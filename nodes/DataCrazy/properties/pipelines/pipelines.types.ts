/**
 * Interface para representar um estágio de pipeline
 */
export interface IStage {
	id: string;
	name: string;
	color: string;
	index: number;
	createdAt: string;
}

/**
 * Interface para resposta da API de estágios
 */
export interface IStagesResponse {
	count: number;
	data: IStage[];
}

/**
 * Interface para representar um pipeline
 */
export interface IPipeline {
	id: string;
	name: string;
	description?: string;
	isActive: boolean;
	isDefault: boolean;
	createdAt: string;
	updatedAt: string;
	stages?: IStage[];
}

/**
 * Interface para parâmetros de query da API de pipelines
 */
export interface IPipelineQueryParams {
	take?: number;
	skip?: number;
	search?: string;
	[key: string]: any; // Index signature para compatibilidade com IDataObject
}

/**
 * Interface para resposta da API de pipeline único
 */
export interface IPipelineResponse {
	success: boolean;
	data: IPipeline;
	message?: string;
}

/**
 * Interface para resposta da API de lista de pipelines
 */
export interface IPipelineListResponse {
	success: boolean;
	data: IPipeline[];
	total: number;
	message?: string;
}