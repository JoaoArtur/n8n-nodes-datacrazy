import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { BASE, single } from '../helpers/context';
import { buildLeadData, buildLeadQueryParams } from '../../nodes/DataCrazy/properties/leads';

describe('leads', () => {
	it('getAll envia busca, searchType e filtros novos', async () => {
		const req = await single({
			resource: 'leads',
			operation: 'getAll',
			options: {
				skip: 10,
				take: 20,
				search: 'joao@x.com',
				searchType: 'email',
				complete: { completeOptions: { additionalFields: true } },
				filters: [{ type: 'COMPANY', role: 'CEO', company: 'ACME', excludeIds: 'a,b', tags: ['t1', 't2'] }],
			},
		});
		assert.equal(req.method, 'GET');
		assert.equal(req.url, `${BASE}/leads`);
		assert.deepEqual(req.query, {
			skip: '10',
			take: '20',
			search: 'joao@x.com',
			searchType: 'email',
			'complete[additionalFields]': 'true',
			'filter[type]': 'COMPANY',
			'filter[role]': 'CEO',
			'filter[company]': 'ACME',
			'filter[excludeIds]': 'a,b',
			'filter[tags]': 't1,t2',
		});
	});

	it('create envia campos novos do payload público', async () => {
		const req = await single({
			resource: 'leads',
			operation: 'create',
			name: 'ACME',
			email: 'a@acme.com',
			additionalFields: {
				type: 'COMPANY',
				birthDate: '2000-01-01',
				displayName: 'ACME Ltda',
				sector: 'Tech',
				role: 'CEO',
				notes: 'obs',
				parentId: 'p1',
				primaryContactLeadId: 'c1',
				address: { addressDetails: { zip: '01000-000', number: '10', complement: 'sala 2' } },
				tags: ['t1'],
				attendant: { attendantDetails: { id: 'att1' } },
			},
		});
		assert.equal(req.method, 'POST');
		assert.equal(req.url, `${BASE}/leads`);
		assert.deepEqual(req.body, {
			name: 'ACME',
			email: 'a@acme.com',
			type: 'COMPANY',
			birthDate: '2000-01-01T00:00:00.000Z',
			displayName: 'ACME Ltda',
			sector: 'Tech',
			role: 'CEO',
			notes: 'obs',
			parentId: 'p1',
			primaryContactLeadId: 'c1',
			address: { zip: '01000-000', number: '10', complement: 'sala 2' },
			tags: [{ id: 't1' }],
			attendant: { id: 'att1' },
		});
	});

	it('get, update e delete usam o ID no path', async () => {
		const get = await single({ resource: 'leads', operation: 'get', leadId: 'L1' });
		assert.equal(`${get.method} ${get.url}`, `GET ${BASE}/leads/L1`);

		const update = await single({ resource: 'leads', operation: 'update', leadId: 'L1', name: 'Novo' });
		assert.equal(`${update.method} ${update.url}`, `PATCH ${BASE}/leads/L1`);
		assert.deepEqual(update.body, { name: 'Novo' });

		const del = await single({ resource: 'leads', operation: 'delete', leadId: 'L1' });
		assert.equal(`${del.method} ${del.url}`, `DELETE ${BASE}/leads/L1`);
	});

	it('getHistory usa a rota pública com paginação e filtros', async () => {
		const req = await single({
			resource: 'leads',
			operation: 'getHistory',
			leadId: 'L1',
			subResourceOptions: { skip: 0, take: 5, businessId: 'B1', comment: 'oi' },
		});
		assert.equal(req.url, `${BASE}/leads/L1/history`);
		assert.deepEqual(req.query, {
			skip: '0',
			take: '5',
			'filter[businessId]': 'B1',
			'filter[comment]': 'oi',
		});
	});

	it('getActivities e getBusinesses aceitam paginação', async () => {
		const activities = await single({
			resource: 'leads',
			operation: 'getActivities',
			leadId: 'L1',
			subResourceOptions: { take: 3, search: 'x' },
		});
		assert.equal(activities.url, `${BASE}/leads/L1/activities`);
		assert.deepEqual(activities.query, { take: '3', search: 'x' });

		const businesses = await single({ resource: 'leads', operation: 'getBusinesses', leadId: 'L1' });
		assert.equal(businesses.url, `${BASE}/leads/L1/businesses`);
		assert.deepEqual(businesses.query, {});
	});

	it('buildLeadData não envia campos vazios', () => {
		assert.deepEqual(buildLeadData({ name: 'X', email: '', additionalFields: { role: '' } }), { name: 'X' });
	});

	it('buildLeadQueryParams normaliza datas de criação para ISO', () => {
		const qs = buildLeadQueryParams({ filters: [{ createdAtGreaterOrEqual: '2025-01-02' }] });
		assert.equal(qs.filter.createdAtGreaterOrEqual, '2025-01-02T00:00:00.000Z');
	});
});
