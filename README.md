# FinanceControl

Este projeto implementa um sistema de controle de gastos residenciais, dividido em um backend (C#/.NET Web API) e um frontend (React com TypeScript).

## 1. Tecnologias usadas

- Backend: C# e .NET 8 (Web API)
- Frontend: React com TypeScript (Vite)
- Banco de dados: Entity Framework Core com SQLite (dados persistentes em `ControleGastos.db`)
- Testes: xUnit com Mock

## 2. Como Executar o Projeto

Para rodar a aplicação, é necessário iniciar o backend e o frontend em terminais separados.

### Pré-requisitos

- .NET SDK 8.0+
- Node.js e pnpm (ou npm/yarn)

---

### Passo 1: Iniciar a API

1. Navegue até o diretório do backend:
   ```cmd
   cd backend

2. Rode o projeto. O banco de dados será criado/atualizado automaticamente:
   ```cmd
   dotnet run
   ```
   A Api está configurada para rodar em http://localhost:5000


### Passo 2: Iniciar o Frontend 
1. Navegue até o diretório do frontend:
   ```cmd
   cd frontend

2. Instale as dependências:
   ```cmd
   pnpm install

3. Inicie o server:
   ```cmd
   pnpm dev
   ```
   O frontend está configurado pra rodar em http://localhost:5173

## 3. Como Executar os Testes
### Passo 1: Mudar o diretório
1. Navegue até o diretório dos testes:
   ```cmd
   cd Testes

2. Troque para o diretório dos testes:
   ```cmd
   cd ControleGastosApi.Testes

### Passo 2: Iniciar os testes
1. Inicie os testes:
   ```cmd
   dotnet test
