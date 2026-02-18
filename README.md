# email-agent foundation

React + TanStack Router/Query + Tailwind CSS のフロントエンド、Hono + Prisma のバックエンド、DDD 構成を含むモノレポです。

## 機能

- Firebase Authentication を使った Google / Microsoft ログイン
- Gmail / Outlook OAuth 連携開始 API とコールバック
- Gmail / Outlook のメール一覧取得 API
- 連携済みメールアカウント情報の保存（Prisma）
- 受信メールに対する返答文の下書き生成 API


## 返答メッセージ生成 API

`POST /api/messages/reply`

リクエスト例:

```json
{
  "senderName": "山田 太郎",
  "receivedMessage": "来週の定例会議の日程について相談させてください。",
  "purpose": "会議日程の調整",
  "tone": "business",
  "includeSignature": true,
  "signerName": "鈴木 花子"
}
```

レスポンス例:

```json
{
  "replyMessage": "山田 太郎様\nお世話になっております。\n\nこの度はご連絡をいただき、誠にありがとうございます。 ..."
}
```

## 構成

- `apps/web`: React フロントエンド
- `apps/api`: Hono API + Prisma + DDD レイヤー

## セットアップ

```bash
pnpm install
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
pnpm --filter api prisma:generate
pnpm --filter api prisma:migrate --name init
pnpm dev
```

- Frontend: http://localhost:5173
- API: http://localhost:8787/api/health

## 必須環境変数

### apps/api/.env

```bash
DATABASE_URL="file:./dev.db"
API_BASE_URL="http://localhost:8787"
OAUTH_STATE_SECRET="replace-me"

FIREBASE_PROJECT_ID=""
FIREBASE_CLIENT_EMAIL=""
FIREBASE_PRIVATE_KEY=""

GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
MICROSOFT_CLIENT_ID=""
MICROSOFT_CLIENT_SECRET=""
```

### apps/web/.env

```bash
VITE_API_BASE_URL="http://localhost:8787"
VITE_FIREBASE_API_KEY=""
VITE_FIREBASE_AUTH_DOMAIN=""
VITE_FIREBASE_PROJECT_ID=""
VITE_FIREBASE_APP_ID=""
```


## メール一覧取得 API

連携済みアカウントに対して、プロバイダー別にメール一覧を取得できます。

- Gmail: `GET /api/integrations/gmail/messages?userId=<USER_ID>&limit=10`
- Outlook: `GET /api/integrations/outlook/messages?userId=<USER_ID>&limit=10`

レスポンスは `emails` 配列で、`subject` / `from` / `preview` / `receivedAt` / `isRead` / `webLink` を返します。

`limit` は 1〜50 の範囲で指定でき、未指定時は 10 件です。

## OAuth のコールバック URL

- Gmail: `http://localhost:8787/api/integrations/gmail/callback`
- Outlook: `http://localhost:8787/api/integrations/outlook/callback`

## Firebase の設定ポイント

- Firebase Authentication で **Google** と **Microsoft** を有効化してください。
- Microsoft プロバイダでは Azure 側のクライアントID/シークレット設定が必要です。
- サーバー側は Firebase Admin SDK で `idToken` を検証し、ユーザーを作成/更新します。
