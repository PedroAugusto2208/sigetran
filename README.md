# SIGETRAN — Sistema de Gestão de Transporte

Projeto acadêmico — Disciplina: Projetos de Software II | Prof. Marcos Lopes | Uniube

## Estrutura do Projeto

```
sigetran/
├── documentos/            # Documentação técnica
│   ├── 4.1-escopo.html
│   ├── 4.2-requisitos.html
│   ├── 4.4-quadro-gestao.html
│   ├── 4.6-documentos-casos-de-uso.html
│   └── 4.11-manual-usuario.html
├── diagramas/             # Diagramas UML (PlantUML)
│   ├── 4.3-casos-de-uso.puml
│   ├── 4.7-DER.puml
│   ├── 4.8-diagrama-classes.puml
│   ├── 4.8-interacoes-componentes.puml
│   └── como-renderizar.html
├── telas/                 # Protótipos web (HTML)
├── telas-mobile/          # Protótipos mobile (HTML)
├── backend/               # API REST (Node.js + Express)
├── frontend/              # Interface web (React + Vite)
└── mobile/                # App mobile (Expo React Native)
```

## Checkpoints

| # | Data  | Valor | Conteúdo |
|---|-------|-------|----------|
| 1 | 19/03 | 10pts | Escopo, Requisitos, Diagrama UC, Quadro de Gestão |
| 2 | 16/04 | 15pts | Protótipos, Docs UC, DER, Diagrama de Classes |
| 3 | 14/05 | 10pts | Backend REST + TDD, Diagrama de Interações |
| 4 | 18/06 | 20pts | Frontend Web, App Mobile, Manual do Usuário, Deploy |

## Rodando o Backend

```bash
cd backend
npm install
cp .env.example .env
npm run dev
# Porta padrão: 3001
# Login padrão: admin / admin123
```

### Executar testes (TDD)
```bash
cd backend
npm test
```

## Rodando o Frontend Web

```bash
cd frontend
npm install
npm run dev
# Porta padrão: 5173
```

## Rodando o App Mobile

```bash
cd mobile
npm install
cp .env.example .env   # ajuste EXPO_PUBLIC_API_URL
npx expo start
```

Telas do app: Login, Dashboard (com menu de módulos), Viagens (+ nova viagem e
mudança de status), Veículos, Motoristas, Clientes, Rotas, Cargas, Fretes,
Usuários e Relatórios — todas consumindo a mesma API REST do backend.

## Deploy (nas nuvens)

### Backend → Render
1. Suba o repositório no GitHub.
2. No Render, crie um **Blueprint** apontando para o repo — ele lê `backend/render.yaml`.
3. O `JWT_SECRET` é gerado automaticamente; o banco SQLite fica no disco persistente `/data`.
4. URL final: `https://sigetran-backend.onrender.com` (ajuste conforme o nome gerado).

### Frontend → Vercel
1. Importe o repo na Vercel, **Root Directory** = `frontend` (config em `frontend/vercel.json`).
2. Defina a variável de ambiente `VITE_API_URL` com a URL do backend no Render.
3. Deploy automático a cada push.

### Mobile → APK (EAS Build)
```bash
cd mobile
npm install -g eas-cli
eas login
eas build -p android --profile preview   # gera APK p/ download (config em eas.json)
```
Ajuste `EXPO_PUBLIC_API_URL` em `mobile/eas.json` para a URL do backend.

## Tecnologias

| Camada | Tecnologia |
|--------|-----------|
| Backend | Node.js + Express + Sequelize + SQLite |
| Autenticação | JWT + bcryptjs |
| Testes | Jest + Supertest |
| Frontend Web | React + Vite |
| Mobile | Expo + React Native |
| Diagramas | PlantUML |
| Deploy Backend | Render |
| Deploy Frontend | Vercel |

## Entidades (8)

1. **USUARIO** — login, senha, nome, tipo, ativo
2. **VEICULO** — placa, modelo, marca, ano, capacidade, ativo
3. **MOTORISTA** — nome, CPF, CNH, telefone, email, ativo
4. **CLIENTE** — nome, CPF/CNPJ, telefone, email, endereço, ativo
5. **ROTA** — origem, destino, distância, tempo, pedágio
6. **CARGA** — descrição, peso, volume, tipo mercadoria
7. **VIAGEM** — veículo, motorista, rota, carga, cliente, status, datas
8. **FRETE** — valor base, pedágio, adicional, total (vinculado à viagem)
