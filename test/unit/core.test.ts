import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { BASE, runLoadOptions, runNode, single } from '../helpers/context';
import { DataCrazyCredentials } from '../../credentials/DataCrazyCredentials.credentials';

describe('request', () => {
	it('usa a base pública e autentica com Bearer', async () => {
		const req = await single({ resource: 'tags', operation: 'getAll' });
		assert.ok(req.url.startsWith(BASE));
		assert.equal(req.headers.Authorization, 'Bearer test-key');
	});

	it('teste da credencial aponta para a base pública', () => {
		const credentials = new DataCrazyCredentials();
		assert.equal(credentials.test.request.baseURL, BASE);
	});
});

describe('execute', () => {
	it('recurso desconhecido gera erro', async () => {
		await assert.rejects(runNode({ resource: 'nope', operation: 'getAll' }), /não é suportado/);
	});

	it('operação desconhecida gera erro', async () => {
		await assert.rejects(runNode({ resource: 'activities', operation: 'nope' }), /não é suportada/);
	});

	it('continueOnFail devolve o erro no item', async () => {
		const { output } = await runNode(
			{ resource: 'tags', operation: 'getAll' },
			{
				continueOnFail: true,
				responder: () => {
					throw new Error('401 Unauthorized');
				},
			},
		);
		assert.deepEqual(output[0].json, { error: '401 Unauthorized' });
	});

	it('resposta em array vira um item por elemento', async () => {
		const { output } = await runNode(
			{ resource: 'pipelines', operation: 'getStages', pipelineId: 'P' },
			{ responder: () => [{ id: 1 }, { id: 2 }] },
		);
		assert.deepEqual(
			output.map((item) => item.json),
			[{ id: 1 }, { id: 2 }],
		);
	});
});

describe('loadOptions', () => {
	it('getPipelines agrupa por grupo', async () => {
		const { requests, result } = await runLoadOptions('getPipelines', {}, () => ({
			data: [
				{ id: 'p2', name: 'B', group: 'Vendas' },
				{ id: 'p1', name: 'A', group: 'Vendas' },
			],
		}));
		assert.equal(requests[0].url, `${BASE}/pipelines`);
		assert.equal(requests[0].query['filter[all]'], undefined);
		assert.deepEqual(
			result.map((o: any) => o.value),
			['group_header_Vendas', 'p1', 'p2'],
		);
	});

	it('getStages usa o pipeline selecionado', async () => {
		const { requests, result } = await runLoadOptions('getStages', { pipelineId: 'P' }, () => ({
			data: [{ id: 's1', name: 'Novo' }],
		}));
		assert.equal(requests[0].url, `${BASE}/pipelines/P/stages`);
		assert.deepEqual(result, [{ name: 'Novo', value: 's1' }]);
	});

	it('getStages sem pipeline não chama a API', async () => {
		const { requests, result } = await runLoadOptions('getStages');
		assert.equal(requests.length, 0);
		assert.deepEqual(result, []);
	});

	it('getLossReasons usa a rota pública', async () => {
		const { requests, result } = await runLoadOptions('getLossReasons', {}, () => ({
			data: [{ id: 'r1', name: 'Preço' }],
		}));
		assert.equal(requests[0].url, `${BASE}/business-loss-reasons`);
		assert.deepEqual(result, [{ name: 'Preço', value: 'r1' }]);
	});

	it('getDepartments usa o serviço messaging via gateway /api/v1/messaging', async () => {
		const { requests, result } = await runLoadOptions('getDepartments', {}, () => ({
			data: [{ id: 'd1', name: 'Suporte' }],
		}));
		assert.equal(requests[0].url, `${BASE}/messaging/departments`);
		assert.deepEqual(result, [{ name: 'Suporte', value: 'd1' }]);
	});

	it('getTags, getAttendants e getInstances', async () => {
		const tags = await runLoadOptions('getTags', {}, () => ({ data: [{ id: 't1', name: 'VIP' }] }));
		assert.equal(tags.requests[0].url, `${BASE}/tags`);
		assert.deepEqual(tags.result, [{ name: 'VIP', value: 't1' }]);

		const attendants = await runLoadOptions('getAttendants', {}, () => ({ data: [{ id: 'a1', name: 'Ana' }] }));
		assert.equal(attendants.requests[0].url, `${BASE}/attendants/crm`);
		assert.deepEqual(attendants.result, [{ name: 'Ana', value: 'a1' }]);

		const instances = await runLoadOptions('getInstances', {}, () => ({ data: [{ id: 'i1', name: 'Whats' }] }));
		assert.equal(instances.requests[0].url, `${BASE}/instances`);
		assert.deepEqual(instances.result, [{ name: 'Whats', value: 'i1' }]);
	});
});
