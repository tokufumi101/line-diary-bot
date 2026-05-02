# ドメイン設計 — Step 1: LINEオウム返しボット

## コンテキスト

LINEユーザーがテキストメッセージを送信すると、同じ内容をそのまま返す。
このステップはボットの動作確認を目的とし、ビジネスロジックは最小限。

---

## エンティティ / 値オブジェクト

### LineMessage（値オブジェクト）

| フィールド | 型 | 説明 |
|---|---|---|
| replyToken | string | LINE返信用トークン（1回のみ使用可能） |
| userId | string | 送信者のLINEユーザーID |
| text | string | 受信したテキスト内容 |

> Step 1ではDBへの永続化は行わないため、エンティティ（ID付き集約）は不要。

---

## ドメインイベント

| イベント | トリガー | アクション |
|---|---|---|
| TextMessageReceived | LINEからWebhookが届く | 同じテキストでLINEに返信する |

---

## ユビキタス言語

| 用語 | 意味 |
|---|---|
| Webhook | LINEからのHTTP POSTリクエスト |
| replyToken | LINE Messaging APIで返信に使う一時トークン |
| オウム返し | 受信メッセージをそのまま返信すること |
| Channel Secret | Webhookの署名検証に使うLINEチャネルの秘密鍵 |
| Channel Access Token | LINE Messaging APIの呼び出しに使うトークン |
