/**
 * Interfaces e tipos para o módulo de Atividades do DataCrazy
 */

export interface IEntityRef {
	id: string;
}

export interface IActivity {
	id: string;
	title: string;
	description?: string;
	startDate?: string;
	endDate?: string;
	attendant?: IEntityRef;
	required?: boolean;
	lead?: IEntityRef;
	linkToStage?: boolean;
	business?: IEntityRef;
	activityType?: IEntityRef;
	flow?: IEntityRef;
	isCompleted?: boolean;
	createdAt?: string;
	updatedAt?: string;
}

export interface IActivityCreate {
	title: string;
	lead: IEntityRef;
	description?: string;
	startDate?: string;
	endDate?: string;
	attendant?: IEntityRef;
	required?: boolean;
	linkToStage?: boolean;
	business?: IEntityRef;
	activityType?: IEntityRef;
	flow?: IEntityRef;
}

export type IActivityUpdate = Partial<IActivityCreate>;

export interface IActivityFilter {
	attendantId?: string;
	startDate?: string;
	startDateLessThan?: string;
	typeId?: string;
	isCompleted?: boolean;
}

export interface IActivityQueryParams {
	skip?: number;
	take?: number;
	search?: string;
	filter?: IActivityFilter;
}

export interface IActivityResponse {
	count: number;
	data: IActivity[];
}
