import { ILoadOptionsFunctions } from 'n8n-workflow';
import { requestForLoadOptions } from '../../GenericFunctions';
import { IInstancesResponse } from './instances.types';

/**
 * Buscar instâncias para loadOptions
 */
export async function getInstancesForLoadOptions(
	context: ILoadOptionsFunctions,
): Promise<{ name: string; value: string }[]> {
	try {
		const endpoint = '/instances';
		const response: IInstancesResponse = await requestForLoadOptions(context, 'GET', endpoint);

		// Mapear os dados para o formato esperado pelo n8n
		return response.data.map((instance) => ({
			name: instance.name,
			value: instance.id,
		}));
	} catch (error) {
		console.error('Erro ao buscar instâncias:', error);
		return [];
	}
}