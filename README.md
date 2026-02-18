# email-agent foundation

React + TanStack Router/Query + Tailwind CSS のフロントエンド、Hono + Prisma のバックエンド、DDD 構成を含むモノレポの土台です。

## 構成

- `apps/web`: React フロントエンド
- `apps/api`: Hono API + Prisma + DDD レイヤー

### Backend DDD レイヤー

- `src/domain`: エンティティ/リポジトリインターフェース
- `src/application`: ユースケース
- `src/infrastructure`: Prisma クライアント/実装リポジトリ
- `src/presentation`: Hono ルート

## セットアップ

```bash
pnpm install
cp apps/api/.env.example apps/api/.env
pnpm --filter api prisma:generate
pnpm --filter api prisma:migrate --name init
pnpm dev
```

- Frontend: http://localhost:5173
- API: http://localhost:8787/api/health
