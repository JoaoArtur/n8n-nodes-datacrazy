/**
 * Interfaces e tipos para o módulo de Deal Actions (Ações de Negócios) do DataCrazy
 */

export interface IDealActionMove {
	ids: string[];
	destinationPipelineId: string;
	destinationStageId: string;
}

export interface IDealActionWin {
	ids: string[];
}

export interface IDealActionLose {
	ids: string[];
	lossReasonId: string;
	justification: string;
}

export interface IDealActionRestore {
	ids: string[];
}

export interface IDealActionResponse {
	success: boolean;
	message: string;
	data?: any;
}

export interface IDealActionResult {
	processedIds: string[];
	failedIds?: string[];
	errors?: string[];
}