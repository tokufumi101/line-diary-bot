# ADR-001: AWS SAM + Node.js を採用する

- **ステータス**: 承認済み
- **日付**: 2026-05-02

---

## コンテキスト

LINEボットのバックエンドをサーバーレスで構築するにあたり、以下を決定する必要があった：
1. IaC（Infrastructure as Code）ツールの選定
2. Lambda のランタイム選定

---

## 決定

- **IaC**: AWS SAM を採用する
- **ランタイム**: Node.js 20.x を採用する

---

## 理由

### AWS SAM を選んだ理由

| 比較対象 | 理由 |
|---|---|
| Terraform | 汎用的だが Lambda + API Gateway の組み合わせには記述量が多い。SAM はサーバーレス特化で `template.yaml` だけで完結する |
| Serverless Framework | サードパーティ依存が大きく、AWS公式サポートのSAMの方が学習コストが低い |
| CDK | TypeScriptの習熟が必要で、今回の学習スコープ外 |

- `sam init` → `sam build` → `sam deploy` の3コマンドで完結するシンプルさ
- AWS公式ツールのため、Lambda・API GatewayのIAMロール自動生成など連携がスムーズ

### Node.js 20.x を選んだ理由

| 比較対象 | 理由 |
|---|---|
| Python | LINE SDK / AWS SDK どちらも充実しているが、今回は軽量JSで十分 |
| Java | Spring Boot経験はあるが、Lambdaのコールドスタートが遅く不向き |
| TypeScript | 型安全だが、初回Step 1はシンプルさを優先。後続Stepで移行を検討 |

- Lambda公式のNode.js SDKが充実しており、サンプルが豊富
- 軽量でコールドスタートが速い

---

## トレードオフ

- SAMはTerraformと比べて柔軟性が低く、複雑なマルチサービス構成には向かない
- Node.jsは型がないため、規模が大きくなったらTypeScriptへの移行を検討する

---

## 結果

Step 1〜5すべてをAWS SAM + Node.js 20.x で実装する。
TypeScriptへの移行はStep 5完了後に判断する。
