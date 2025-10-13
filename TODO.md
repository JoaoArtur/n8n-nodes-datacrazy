## Tarefas

- [] Campos adicionais (Lead & Deals)
- [] Definir os campos adicionais em um lead ou deal.
- [] Finalizar conversas

### Adicionar os campos adicionais (Lead & Deals) na documentação.

https://api.datacrazy.io/v1/api/api/v1/crm/crm/additionalFields?skip=0&take=10&filter%5Bentity%5D=business
https://api.datacrazy.io/v1/api/api/v1/crm/crm/additionalFields?skip=0&take=10&filter%5Bentity%5D=lead

### Finalizar as conversas com os clientes.

https://messaging.g1.datacrazy.io/api/messaging/conversations/CONVERSATION_ID/finish

### Definir os campos adicionais em um lead ou deal.

curl --location 'https://api.datacrazy.io/v1/api/api/v1/crm/crm/additional-fields/lead/LEAD_ID/ADITIONAL_FIELD_ID' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer dc_eyJh' \
--data '{"value":"12132"}'

curl --location 'https://api.datacrazy.io/v1/api/api/v1/crm/crm/additional-fields/deal/DEAL_ID/ADITIONAL_FIELD_ID' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer dc_eyJh' \
--data '{"value":"12132"}'
