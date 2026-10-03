import { IExecuteFunctions } from 'n8n-workflow';
import { request } from '../../GenericFunctions';
import { IInstance, IInstancesResponse } from './instances.types';

/**
 * Buscar todas as conexões
 */
export async function getAllInstances(this: IExecuteFunctions): Promise<IInstancesResponse> {
	const endpoint = '/instances';
	return await request(this, 'GET', endpoint);
}

/**
 * Buscar conexão por ID
 */
export async function getInstanceById(this: IExecuteFunctions, instanceId: string): Promise<IInstance> {
	const endpoint = `/instances/${instanceId}`;
	return await request(this, 'GET', endpoint);
}
