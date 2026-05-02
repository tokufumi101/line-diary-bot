# LINE Diary Bot

LINEで英語日記を投稿すると、Claude APIが文法・表現のフィードバックを返すボット。

## アーキテクチャ

```
ユーザー（LINE） → LINE Messaging API → API Gateway → Lambda → LINE返信
```

## 前提条件

- [AWS CLI](https://aws.amazon.com/cli/) インストール済み・設定済み（`aws configure`）
- [AWS SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html) インストール済み
- [LINE Developers](https://developers.line.biz/) でチャネル作成済み

## デプロイ手順

### 1. ビルド

```bash
sam build
```

### 2. デプロイ

初回は `--guided` オプションをつけてインタラクティブに設定する。

```bash
sam deploy --guided
```

以下の項目を入力する：

| 項目 | 説明 |
|---|---|
| Stack Name | `line-diary-bot`（任意） |
| AWS Region | `ap-northeast-1`（東京） |
| LineChannelSecret | LINE DevelopersのChannel Secret |
| LineChannelAccessToken | LINE DevelopersのChannel Access Token |
| Confirm changes before deploy | `y` |
| Allow SAM CLI IAM role creation | `y` |
| Save arguments to configuration file | `y`（`samconfig.toml`に保存） |

### 3. WebhookURLの取得

デプロイ完了後、Outputsに表示されるURLをコピーする。

```
Outputs:
  WebhookUrl: https://xxxxxxxxxx.execute-api.ap-northeast-1.amazonaws.com/Prod/webhook
```

### 4. LINE DevelopersにWebhookURLを設定

1. [LINE Developers Console](https://developers.line.biz/console/) を開く
2. チャネル → Messaging API設定 → Webhook URL に上記URLを貼り付ける
3. 「検証」ボタンで動作確認

### 5. 動作確認

LINEでボットにテキストメッセージを送信し、同じ内容が返ってくればOK。

## ディレクトリ構成

```
line-diary-bot/
├── template.yaml          # SAMテンプレート（Lambda + API Gateway定義）
├── src/
│   └── handlers/
│       └── webhook.js     # LambdaハンドラーとLINE Webhook処理
├── docs/
│   ├── domain.md          # ドメイン設計
│   └── adr/
│       └── ADR-001-sam-nodejs.md  # アーキテクチャ決定記録
└── README.md
```

## 開発ステップ

- [x] Step 1: Lambda + API Gateway でオウム返しボット
- [ ] Step 2: Transcribeで音声→テキスト変換
- [ ] Step 3: Claude APIでフィードバック生成
- [ ] Step 4: DynamoDBに日記を保存
