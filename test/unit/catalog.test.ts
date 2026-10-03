import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { BASE, runNode, single } from '../helpers/context';

describe('tags', () => {
	it('CRUD e contagem de leads', async () => {
		const list = await single({ resource: 'tags', operation: 'getAll' });
		assert.equal(`${list.method} ${list.url}`, `GET ${BASE}/tags`);

		const create = await single({
			resource: 'tags',
			operation: 'create',
			name: 'VIP',
			color: '#000000',
			additionalFields: { description: 'clientes vip' },
		});
		assert.equal(`${create.method} ${create.url}`, `POST ${BASE}/tags`);
		assert.deepEqual(create.body, { name: 'VIP', color: '#000000', description: 'clientes vip' });

		const get = await single({ resource: 'tags', operation: 'get', tagId: 'T' });
		assert.equal(`${get.method} ${get.url}`, `GET ${BASE}/tags/T`);

		const update = await single({ resource: 'tags', operation: 'update', tagId: 'T', additionalFields: { name: 'VIP2' } });
		assert.equal(`${update.method} ${update.url}`, `PUT ${BASE}/tags/T`);
		assert.deepEqual(update.body, { name: 'VIP2' });

		const del = await single({ resource: 'tags', operation: 'delete', tagId: 'T' });
		assert.equal(`${del.method} ${del.url}`, `DELETE ${BASE}/tags/T`);

		const count = await single({ resource: 'tags', operation: 'getLeadsCount', tagId: 'T' });
		assert.equal(`${count.method} ${count.url}`, `GET ${BASE}/tags/T/leads-count`);
	});
});

describe('tags: update sem nome', () => {
	// A API rejeita PUT sem name ("tag-name-already-exists"); o node completa com o nome atual.
	it('busca o nome atual antes do PUT', async () => {
		const { requests } = await runNode(
			{ resource: 'tags', operation: 'update', tagId: 'T', additionalFields: { description: 'nova' } },
			{ responder: (req) => (req.method === 'GET' ? { id: 'T', name: 'VIP' } : {}) },
		);
		assert.deepEqual(
			requests.map((r) => `${r.method} ${r.url}`),
			[`GET ${BASE}/tags/T`, `PUT ${BASE}/tags/T`],
		);
		assert.deepEqual(requests[1].body, { name: 'VIP', description: 'nova' });
	});
});

describe('lists', () => {
	it('CRUD', async () => {
		const list = await single({ resource: 'lists', operation: 'getAll', listOptions: { take: 5 } });
		assert.equal(`${list.method} ${list.url}`, `GET ${BASE}/lists`);
		assert.deepEqual(list.query, { take: '5' });

		const create = await single({
			resource: 'lists',
			operation: 'create',
			listName: 'Newsletter',
			listAdditionalFields: { description: 'd' },
		});
		assert.equal(`${create.method} ${create.url}`, `POST ${BASE}/lists`);
		assert.deepEqual(create.body, { name: 'Newsletter', description: 'd' });

		const get = await single({ resource: 'lists', operation: 'get', listId: 'LS' });
		assert.equal(`${get.method} ${get.url}`, `GET ${BASE}/lists/LS`);

		const update = await single({ resource: 'lists', operation: 'update', listId: 'LS', listAdditionalFields: { name: 'N2' } });
		assert.equal(`${update.method} ${update.url}`, `PUT ${BASE}/lists/LS`);
		assert.deepEqual(update.body, { name: 'N2' });

		const del = await single({ resource: 'lists', operation: 'delete', listId: 'LS' });
		assert.equal(`${del.method} ${del.url}`, `DELETE ${BASE}/lists/LS`);
	});
});

describe('products', () => {
	it('CRUD', async () => {
		const list = await single({ resource: 'products', operation: 'getAll', productOptions: {} });
		assert.equal(`${list.method} ${list.url}`, `GET ${BASE}/products`);

		const create = await single({
			resource: 'products',
			operation: 'create',
			productName: 'Plano',
			productPrice: 99.9,
			productAdditionalFields: { id_sku: 'SKU1' },
		});
		assert.equal(`${create.method} ${create.url}`, `POST ${BASE}/products`);
		assert.deepEqual(create.body, { id_sku: 'SKU1', name: 'Plano', price: 99.9 });

		const get = await single({ resource: 'products', operation: 'get', productId: 'PR' });
		assert.equal(`${get.method} ${get.url}`, `GET ${BASE}/products/PR`);

		const update = await single({
			resource: 'products',
			operation: 'update',
			productId: 'PR',
			productAdditionalFields: { price: 10 },
		});
		assert.equal(`${update.method} ${update.url}`, `PUT ${BASE}/products/PR`);
		assert.deepEqual(update.body, { price: 10 });

		const del = await single({ resource: 'products', operation: 'delete', productId: 'PR' });
		assert.equal(`${del.method} ${del.url}`, `DELETE ${BASE}/products/PR`);
	});
});

describe('lossReasons', () => {
	it('CRUD', async () => {
		const list = await single({ resource: 'lossReasons', operation: 'getAll', lossReasonSkip: 0, lossReasonTake: 20 });
		assert.equal(`${list.method} ${list.url}`, `GET ${BASE}/business-loss-reasons`);
		assert.deepEqual(list.query, { skip: '0', take: '20' });

		const create = await single({
			resource: 'lossReasons',
			operation: 'create',
			lossReasonName: 'Preço',
			lossReasonRequiredJustification: true,
		});
		assert.equal(`${create.method} ${create.url}`, `POST ${BASE}/business-loss-reasons`);
		assert.deepEqual(create.body, { name: 'Preço', requiredJustification: true });

		const get = await single({ resource: 'lossReasons', operation: 'get', lossReasonRecordId: 'R' });
		assert.equal(`${get.method} ${get.url}`, `GET ${BASE}/business-loss-reasons/R`);

		const update = await single({
			resource: 'lossReasons',
			operation: 'update',
			lossReasonRecordId: 'R',
			lossReasonUpdateFields: { name: 'Prazo' },
		});
		assert.equal(`${update.method} ${update.url}`, `PUT ${BASE}/business-loss-reasons/R`);
		assert.deepEqual(update.body, { name: 'Prazo' });

		const del = await single({ resource: 'lossReasons', operation: 'delete', lossReasonRecordId: 'R' });
		assert.equal(`${del.method} ${del.url}`, `DELETE ${BASE}/business-loss-reasons/R`);
	});
});
