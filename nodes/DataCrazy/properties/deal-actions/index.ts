/**
 * Exportações centralizadas do módulo Deal Actions
 */

// Tipos e interfaces
export * from './deal-actions.types';

// Funções da API
export * from './deal-actions.functions';

// Operações
export { dealActionsOperations } from './deal-actions.operations';

// Campos
export { 
	dealIds,
	destinationPipelineId,
	destinationStageId,
	lossReasonId,
	justification,
	additionalFields
} from './deal-actions.fields';