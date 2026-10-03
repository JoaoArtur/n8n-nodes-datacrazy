# DataCrazy Community Node N8N

[![npm version](https://badge.fury.io/js/n8n-nodes-datacrazy.svg)](https://badge.fury.io/js/n8n-nodes-datacrazy)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Este é um nó da comunidade N8N para integração completa com a plataforma DataCrazy, oferecendo acesso a todas as funcionalidades de CRM, messaging e gerenciamento de dados.

## 📋 Índice

- [Instalação](#instalação)
- [Configuração](#configuração)
- [Módulos Disponíveis](#módulos-disponíveis)
- [Exemplos de Uso](#exemplos-de-uso)
- [Desenvolvimento](#desenvolvimento)
- [Reportar Issues](#reportar-issues)
- [Contribuição](#contribuição)
- [Licença](#licença)

## 🚀 Instalação

### Via n8n Community Nodes

1. Acesse as configurações do n8n
2. Vá para "Community Nodes"
3. Instale o pacote: `n8n-nodes-datacrazy`

### Via npm

```bash
npm install n8n-nodes-datacrazy
```

## ⚙️ Configuração

1. Crie uma nova credencial do tipo "DataCrazy Credentials"
2. Configure os seguintes campos:
   - **API Key**: Sua chave de API do DataCrazy

O node usa a API pública do DataCrazy (`https://api.g1.datacrazy.io/api/v1`).

## 📦 Módulos Disponíveis

### 🎯 Leads

Gerenciamento completo de leads no sistema DataCrazy.

**Operações Disponíveis:**
- **Buscar Leads**: Lista todos os leads com filtros avançados
- **Criar Lead**: Cria um novo lead no sistema
- **Buscar por ID**: Recupera um lead específico
- **Atualizar Lead**: Modifica dados de um lead existente
- **Excluir Lead**: Remove um lead do sistema
- **Buscar Atividades**: Lista atividades relacionadas ao lead
- **Buscar Histórico**: Recupera histórico de alterações
- **Buscar Negócios do Lead**: Lista negócios associados

**Recursos:**
- Pessoa física ou empresa (`type`), cargo, setor, notas, lead pai e contato principal
- Filtros por tipo, cargo, empresa, tags, estágios, atendente, datas e IDs a excluir
- Busca por texto com tipo de busca (nome, email, telefone, CPF/CNPJ). A busca exige no mínimo 4 caracteres
- Paginação com skip/take, inclusive em atividades, histórico e negócios do lead
- Campos personalizáveis

### 💼 Negócios (Deals)

Gestão completa do pipeline de vendas e negócios.

**Operações Disponíveis:**
- **Buscar Negócios**: Lista todos os negócios
- **Buscar por Estágio**: Lista negócios de um estágio
- **Criar Negócio**: Cria um novo negócio
- **Buscar por ID**: Recupera um negócio específico
- **Atualizar Negócio**: Modifica dados de um negócio
- **Excluir Negócio**: Remove um negócio

**Recursos:**
- Associação com leads
- Seleção de pipeline e estágio
- ID externo
- Filtros avançados por status, valor, datas, tags, produtos e atendentes

### 🎬 Ações de Negócios (Deal Actions)

Operações em lote para gerenciamento eficiente de negócios.

**Operações Disponíveis:**
- **Mover**: Move negócios para outro estágio
- **Ganhar**: Marca negócios como ganhos
- **Perder**: Marca negócios como perdidos com motivo
- **Restaurar**: Restaura negócios para estado ativo

**Recursos:**
- Processamento em lote
- Seleção dinâmica de pipelines e estágios
- Motivos de perda configuráveis
- Justificativas opcionais

### 💬 Conversas

Sistema completo de messaging e atendimento ao cliente.

**Operações Disponíveis:**
- **Buscar Conversas**: Lista todas as conversas
- **Buscar Conversa por ID**: Recupera conversa específica com mensagens
- **Enviar Mensagem**: Envia mensagem para uma conversa
- **Finalizar Conversa**: Finaliza atendimento ao cliente

**Recursos:**
- Suporte a anexos e arquivos
- Mensagens agendadas
- Mensagens internas
- Resposta a mensagens específicas
- Filtros por status, janela aberta (24h), departamentos, conexões, tags, estágio e atendentes

### 📎 Anexos (Lead)

Gerenciamento de arquivos e documentos associados aos leads.

**Operações Disponíveis:**
- **Listar Anexos**: Lista todos os anexos de um lead
- **Anexar Arquivo**: Adiciona arquivo ao lead
- **Apagar Anexo**: Remove anexo do lead

**Recursos:**
- Anexo por URL, com nome e tamanho do arquivo (obrigatório na API)
- Associação automática com leads

### 📝 Anotações

Sistema de comentários e observações para leads.

**Operações Disponíveis:**
- **Buscar Comentários**: Lista comentários de um lead
- **Adicionar Comentário**: Cria novo comentário
- **Atualizar Comentário**: Modifica comentário existente
- **Excluir Comentário**: Remove comentário

**Recursos:**
- Comentários com timestamp
- Associação com usuários
- Histórico completo de alterações

### 🏷️ Tags

Sistema de etiquetas para categorização e organização.

**Operações Disponíveis:**
- **Buscar Todas**: Lista todas as tags disponíveis
- **Criar**: Cria nova tag
- **Buscar por ID**: Recupera tag específica
- **Atualizar**: Modifica tag existente
- **Excluir**: Remove tag do sistema
- **Contar Leads**: Quantidade de leads com a tag

**Recursos:**
- Cores personalizáveis
- Categorização flexível
- Associação com múltiplos recursos

### 🔧 Pipelines

Gerenciamento de pipelines de vendas e seus estágios.

**Operações Disponíveis:**
- **Listar Todos**: Lista todos os pipelines
- **Buscar por ID**: Recupera um pipeline com suas permissões
- **Listar Estágios**: Lista estágios de um pipeline específico

**Recursos:**
- Agrupamento por grupo de pipelines
- Busca por texto

### 📅 Atividades

Tarefas e compromissos vinculados a leads e negócios.

**Operações Disponíveis:**
- **Buscar Todas**, **Criar**, **Buscar por ID**, **Atualizar**, **Excluir**

**Recursos:**
- Data de início e de término obrigatórias na criação
- Vínculo com lead, negócio, atendente, tipo de atividade e fluxo
- Filtros por atendente, período, tipo e concluída

### 📋 Listas

Listas para segmentação de leads.

**Operações Disponíveis:**
- **Buscar Todas**, **Criar**, **Buscar por ID**, **Atualizar**, **Excluir**

### 📦 Produtos

Catálogo de produtos (SKU, nome e preço).

**Operações Disponíveis:**
- **Buscar Todos**, **Criar**, **Buscar por ID**, **Atualizar**, **Excluir**

### 📁 Anexos de Negócio

Arquivos associados a negócios.

**Operações Disponíveis:**
- **Listar Anexos**: Lista os anexos de um negócio
- **Anexar Arquivo**: Anexa um arquivo por URL (nome e tamanho obrigatórios)
- **Apagar Anexos**: Remove vários anexos de uma vez (IDs separados por vírgula)

### ❌ Motivos de Perda

Motivos usados ao marcar negócios como perdidos.

**Operações Disponíveis:**
- **Buscar Todos**, **Criar**, **Buscar por ID**, **Atualizar**, **Excluir**

**Recursos:**
- Justificativa obrigatória configurável por motivo

### 🔌 Conexões

Instâncias de canais de atendimento (ex.: WhatsApp).

**Operações Disponíveis:**
- **Buscar Todas**: Lista as conexões
- **Buscar por ID**: Recupera uma conexão

### 👥 Atendentes

Usuários do CRM e do multiatendimento.

**Operações Disponíveis:**
- **Buscar Todos (CRM)** e **Buscar por ID (CRM)**
- **Buscar Todos (Multi)** e **Buscar por ID (Multi)**: atendentes do multiatendimento

### ➕ Campos Adicionais

Sistema flexível de campos personalizados para leads e negócios.

**Operações Disponíveis:**
- **Buscar Campos Adicionais**: Lista campos disponíveis
- **Definir Campo Adicional**: Define valor para campo personalizado

**Recursos:**
- Escopo por tipo (Lead/Deal)
- Tipos de dados variados
- Validação automática
- Carregamento dinâmico de opções

## 🛠️ Desenvolvimento

### Pré-requisitos

- Node.js >= 18.10
- pnpm >= 9.1

### Configuração do Ambiente

```bash
# Clone o repositório
git clone https://github.com/joaoartur/n8n-nodes-datacrazy.git

# Instale as dependências
pnpm install

# Execute em modo de desenvolvimento
pnpm dev

# Build para produção
pnpm build

# Execute linting
pnpm lint
```

### Testes

```bash
# Unitários: executam o node com a API simulada e validam método, URL, query e body
pnpm test

# Integração contra a API real (somente leitura)
DATACRAZY_API_KEY=sua_chave pnpm test:integration

# Integração com escrita: cria e remove registros de teste (prefixo n8n-e2e-)
DATACRAZY_API_KEY=sua_chave DATACRAZY_E2E_WRITE=1 pnpm test:integration
```

Sem `DATACRAZY_API_KEY`, os testes de integração são pulados. Nunca commite a chave.

### Estrutura do Projeto

```
nodes/DataCrazy/
├── DataCrazy.node.ts          # Nó principal
├── GenericFunctions.ts        # Funções utilitárias
└── properties/                # Módulos organizados
    ├── leads/                 # Módulo de leads
    ├── deals/                 # Módulo de negócios
    ├── conversations/         # Módulo de conversas
    ├── annotations/           # Módulo de anotações
    ├── attachments/           # Módulo de anexos
    ├── tags/                  # Módulo de tags
    ├── pipelines/             # Módulo de pipelines
    ├── deal-actions/          # Módulo de ações de negócios
    ├── deal-attachments/      # Módulo de anexos de negócio
    ├── activities/            # Módulo de atividades
    ├── lists/                 # Módulo de listas
    ├── products/              # Módulo de produtos
    ├── business-loss-reasons/ # Módulo de motivos de perda
    ├── instances/             # Módulo de conexões
    ├── attendants-crm/        # Módulo de atendentes
    └── additional-fields/     # Módulo de campos adicionais

test/
├── helpers/                   # Contexto simulado do n8n
├── unit/                      # Testes unitários
└── integration/               # Testes contra a API real
```

Cada módulo segue a estrutura:
- `*.operations.ts` - Definição das operações disponíveis
- `*.fields.ts` - Campos de entrada do usuário
- `*.functions.ts` - Lógica de integração com API
- `*.types.ts` - Interfaces TypeScript
- `index.ts` - Exportações centralizadas

## 🐛 Reportar Issues

Encontrou um bug ou tem uma sugestão? Ajude-nos a melhorar!

### Como Reportar

1. **Verifique Issues Existentes**: Antes de criar uma nova issue, verifique se o problema já foi reportado em [Issues](https://github.com/joaoartur/n8n-nodes-datacrazy/issues).

2. **Crie uma Nova Issue**: Se não encontrar uma issue similar, [crie uma nova](https://github.com/joaoartur/n8n-nodes-datacrazy/issues/new).

### Informações Necessárias

Para nos ajudar a resolver o problema rapidamente, inclua:

**Para Bugs:**
- **Descrição**: Descreva o problema claramente
- **Passos para Reproduzir**: Liste os passos exatos para reproduzir o bug
- **Comportamento Esperado**: O que deveria acontecer
- **Comportamento Atual**: O que está acontecendo
- **Ambiente**:
  - Versão do n8n
  - Versão do node DataCrazy
  - Sistema operacional
- **Logs de Erro**: Inclua mensagens de erro completas
- **Screenshots**: Se aplicável, adicione capturas de tela

**Para Solicitações de Recursos:**
- **Descrição**: Descreva o recurso desejado
- **Justificativa**: Por que este recurso seria útil
- **Casos de Uso**: Exemplos de como seria usado
- **Alternativas**: Soluções alternativas consideradas

### Template de Issue

```markdown
## Tipo
- [ ] Bug
- [ ] Solicitação de Recurso
- [ ] Melhoria
- [ ] Documentação

## Descrição
[Descreva o problema ou recurso]

## Ambiente (para bugs)
- Versão do n8n:
- Versão do n8n-nodes-datacrazy:
- Sistema Operacional:
- Node.js:

## Passos para Reproduzir (para bugs)
1.
2.
3.

## Comportamento Esperado
[O que deveria acontecer]

## Comportamento Atual
[O que está acontecendo]

## Logs de Erro
```
[Cole os logs aqui]
```

## Informações Adicionais
[Qualquer informação adicional relevante]
```

### Prioridade de Issues

- **🔴 Crítica**: Falhas que impedem o uso básico
- **🟡 Alta**: Bugs importantes ou recursos muito solicitados
- **🟢 Média**: Melhorias e bugs menores
- **🔵 Baixa**: Documentação e otimizações

## 🤝 Contribuição

Contribuições são bem-vindas! Por favor, leia nosso guia de contribuição antes de submeter pull requests.

### Processo de Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 📞 Suporte

- **Email**: contato@datacrazy.io
- **Documentação**: [DataCrazy Docs](https://docs.datacrazy.io)
- **Issues**: [GitHub Issues](https://github.com/joaoartur/n8n-nodes-datacrazy/issues)

---

**Desenvolvido com ❤️ pela equipe DataCrazy**