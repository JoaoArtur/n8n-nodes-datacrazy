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
- Filtros por pipeline, estágio, atendente
- Paginação com skip/take
- Busca por texto
- Campos personalizáveis

### 💼 Negócios (Deals)

Gestão completa do pipeline de vendas e negócios.

**Operações Disponíveis:**
- **Buscar Negócios**: Lista todos os negócios
- **Criar Negócio**: Cria um novo negócio
- **Buscar por ID**: Recupera um negócio específico
- **Atualizar Negócio**: Modifica dados de um negócio
- **Excluir Negócio**: Remove um negócio

**Recursos:**
- Associação com leads
- Definição de valor e pipeline
- Campos adicionais personalizáveis
- Filtros avançados por estágio

### 🎬 Ações de Negócios (Deal Actions)

Operações em lote para gerenciamento eficiente de negócios.

**Operações Disponíveis:**
- **Mover**: Move negócios para outro estágio/pipeline
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
- Base URL específica para messaging

### 📎 Anexos

Gerenciamento de arquivos e documentos associados aos leads.

**Operações Disponíveis:**
- **Listar Anexos**: Lista todos os anexos de um lead
- **Anexar Arquivo**: Adiciona arquivo ao lead
- **Apagar Anexo**: Remove anexo do lead

**Recursos:**
- Upload de múltiplos tipos de arquivo
- Associação automática com leads
- Controle de permissões

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

**Recursos:**
- Cores personalizáveis
- Categorização flexível
- Associação com múltiplos recursos

### 🔧 Pipelines

Gerenciamento de pipelines de vendas e seus estágios.

**Operações Disponíveis:**
- **Listar Todos**: Lista todos os pipelines
- **Listar Estágios**: Lista estágios de um pipeline específico

**Recursos:**
- Estrutura hierárquica
- Configuração de estágios
- Filtros e paginação

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
    └── additional-fields/     # Módulo de campos adicionais
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

- **Email**: contato@datacrazy.com
- **Documentação**: [DataCrazy Docs](https://docs.datacrazy.com)
- **Issues**: [GitHub Issues](https://github.com/joaoartur/n8n-nodes-datacrazy/issues)

---

**Desenvolvido com ❤️ pela equipe DataCrazy**