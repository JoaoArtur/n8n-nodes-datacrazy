import { IExecuteFunctions } from 'n8n-workflow';
import { request } from '../../GenericFunctions';
import { ITag, ITagCreate, ITagUpdate, ITagResponse } from './tags.types';

/**
 * Buscar todas as tags
 */
export async function getAllTags(this: IExecuteFunctions): Promise<ITagResponse> {
	const endpoint = '/tags';
	return await request(this, 'GET', endpoint);
}

/**
 * Criar uma nova tag
 */
export async function createTag(this: IExecuteFunctions, tagData: ITagCreate): Promise<ITag> {
	const endpoint = '/tags';
	return await request(this, 'POST', endpoint, tagData);
}

/**
 * Buscar tag por ID
 */
export async function getTagById(this: IExecuteFunctions, tagId: string): Promise<ITag> {
	const endpoint = `/tags/${tagId}`;
	return await request(this, 'GET', endpoint);
}

/**
 * Atualizar tag
 */
export async function updateTag(this: IExecuteFunctions, tagId: string, tagData: ITagUpdate): Promise<ITag> {
	const endpoint = `/tags/${tagId}`;
	return await request(this, 'PUT', endpoint, tagData);
}

/**
 * Excluir tag
 */
export async function deleteTag(this: IExecuteFunctions, tagId: string): Promise<void> {
	const endpoint = `/tags/${tagId}`;
	return await request(this, 'DELETE', endpoint);
}

/**
 * Função auxiliar para construir dados da tag
 */
export function buildTagData(data: any): ITagCreate | ITagUpdate {
	const tagData: any = {};

	if (data.name !== undefined) {
		tagData.name = data.name;
	}

	if (data.color !== undefined) {
		tagData.color = data.color;
	}

	if (data.description !== undefined && data.description !== '') {
		tagData.description = data.description;
	}

	if (data.useRandomColor !== undefined) {
		tagData.useRandomColor = data.useRandomColor;
	}

	return tagData;
}