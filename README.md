# CRUD Backend - Sistema de Gerenciamento de Clientes, Produtos e Pedidos

Backend desenvolvido em NestJS para gerenciamento de clientes, produtos e pedidos com autenticação JWT e controle de acesso baseado em roles.

## 🚀 Tecnologias

- **NestJS** - Framework Node.js
- **TypeScript** - Linguagem de programação
- **TypeORM** - ORM para PostgreSQL
- **PostgreSQL** - Banco de dados
- **JWT** - Autenticação
- **Swagger** - Documentação da API
- **Docker** - Containerização
- **Class Validator** - Validação de DTOs

## 📋 Requisitos

- Node.js 20+
- Docker e Docker Compose
- npm ou yarn

## 🔧 Instalação

### 1. Clone o repositório

```bash
git clone <repository-url>
cd crud_backend
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Copie o arquivo `.env.example` para `.env`:

```bash
cp .env.example .env
```

Ajuste as variáveis conforme necessário.

### 4. Inicie o PostgreSQL com Docker

```bash
docker-compose up -d postgres
```

### 5. Execute o seed para criar o usuário admin

```bash
npm run seed
```

**Credenciais do Admin:**
- Email: `admin@admin.com`
- Senha: `admin123`

### 6. Inicie a aplicação

```bash
# Desenvolvimento
npm run start:dev

# Produção
npm run build
npm run start:prod
```

## 🐳 Docker

Para executar toda a stack (banco de dados + aplicação):

```bash
docker-compose up
```

## 📚 Documentação da API

Acesse a documentação Swagger em:

```
http://localhost:3000/api/docs
```

## 🔐 Autenticação

A API usa JWT para autenticação. Existem dois perfis de usuário:

### ADMIN
- Acesso total ao sistema
- CRUD completo de clientes, produtos e pedidos

### USUARIO
- Pode visualizar produtos
- Pode criar pedidos
- Não pode excluir produtos ou pedidos

### Como autenticar

1. Registre-se ou faça login no endpoint `/api/v1/auth/login`
2. Copie o token JWT retornado
3. No Swagger, clique em "Authorize" e cole o token
4. Ou use o header: `Authorization: Bearer <seu-token>`

## 📡 Endpoints Principais

### Auth
- `POST /api/v1/auth/register` - Registrar novo usuário
- `POST /api/v1/auth/login` - Fazer login

### Clientes (ADMIN apenas)
- `GET /api/v1/clientes` - Listar clientes (paginado)
- `POST /api/v1/clientes` - Criar cliente
- `GET /api/v1/clientes/:id` - Buscar cliente
- `PATCH /api/v1/clientes/:id` - Atualizar cliente
- `DELETE /api/v1/clientes/:id` - Deletar cliente
- `GET /api/v1/clientes/consulta-cnpj/:cnpj` - Consultar CNPJ (API externa)

### Produtos
- `GET /api/v1/produtos` - Listar produtos (ADMIN + USUARIO)
- `POST /api/v1/produtos` - Criar produto (ADMIN)
- `GET /api/v1/produtos/:id` - Buscar produto (ADMIN + USUARIO)
- `PATCH /api/v1/produtos/:id` - Atualizar produto (ADMIN)
- `DELETE /api/v1/produtos/:id` - Deletar produto (ADMIN)
- `POST /api/v1/produtos/:id/imagens` - Upload de imagens (ADMIN)
- `DELETE /api/v1/produtos/:id/imagens/:imagemId` - Deletar imagem (ADMIN)

### Pedidos
- `GET /api/v1/pedidos` - Listar pedidos (ADMIN + USUARIO)
- `POST /api/v1/pedidos` - Criar pedido (ADMIN + USUARIO)
- `GET /api/v1/pedidos/:id` - Buscar pedido (ADMIN + USUARIO)
- `DELETE /api/v1/pedidos/:id` - Deletar pedido (ADMIN apenas)

## 🗄️ Estrutura do Banco de Dados

### Tabelas

- `usuarios` - Usuários do sistema
- `clientes` - Clientes cadastrados
- `produtos` - Produtos disponíveis
- `produto_imagens` - Imagens dos produtos
- `pedidos` - Pedidos realizados
- `pedido_itens` - Itens de cada pedido

## 📦 Funcionalidades Especiais

### Consulta de CNPJ
A API integra com a API pública `https://publica.cnpj.ws` para buscar dados de empresas por CNPJ.

### Upload de Imagens
Os produtos suportam múltiplas imagens. As imagens são armazenadas localmente em `./uploads/produtos` e servidas via endpoint `/uploads/produtos/<filename>`.

### Controle de Estoque
Ao criar um pedido, o sistema:
1. Valida se o cliente existe
2. Valida se todos os produtos existem
3. Verifica se há estoque suficiente
4. Decrementa o estoque automaticamente
5. Calcula o total do pedido
6. Tudo dentro de uma transação (rollback em caso de erro)

### Paginação
Todas as listagens suportam paginação via query params:
- `page` - Número da página (padrão: 1)
- `limit` - Itens por página (padrão: 10, máximo: 100)

Exemplo: `GET /api/v1/produtos?page=2&limit=20`

## 🧪 Testes

```bash
# Testes unitários
npm run test

# Testes e2e
npm run test:e2e

# Cobertura
npm run test:cov
```

## 📝 Scripts Disponíveis

```bash
npm run build          # Compilar o projeto
npm run start          # Iniciar aplicação
npm run start:dev      # Modo desenvolvimento (watch)
npm run start:prod     # Modo produção
npm run seed           # Criar usuário admin
npm run lint           # Executar linter
npm run format         # Formatar código
```

## 🏗️ Arquitetura

O projeto segue a arquitetura em camadas:

```
Controller (Rotas HTTP)
    ↓
Service (Lógica de negócio)
    ↓
Repository (TypeORM - Acesso ao banco)
```

### Estrutura de Pastas

```
src/
├── auth/              # Autenticação e autorização
├── usuarios/          # Gerenciamento de usuários
├── clientes/          # CRUD de clientes
├── produtos/          # CRUD de produtos
├── pedidos/           # CRUD de pedidos
├── cnpj/              # Integração com API de CNPJ
├── common/            # Código compartilhado
│   ├── decorators/    # Decorators customizados
│   ├── guards/        # Guards de autenticação/autorização
│   ├── filters/       # Exception filters
│   ├── dto/           # DTOs compartilhados
│   └── interfaces/    # Interfaces compartilhadas
└── config/            # Configurações
```

## 🔒 Segurança

- Senhas são hashadas com bcrypt (salt rounds: 10)
- JWT com expiração configurável
- Validação de entrada com class-validator
- Guards para proteção de rotas
- CORS habilitado
- Tratamento global de exceções

## 📄 Licença

UNLICENSED - Projeto privado
