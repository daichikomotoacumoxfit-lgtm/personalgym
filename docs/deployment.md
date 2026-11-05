# Vercelで誰でも閲覧できるURLを作る

Vercelへの配置は、クラウド開発環境の「環境を公開」とは別です。開発環境の公開だけではWebサイトの一般公開URLは作られません。

## 現在の内容を確認用サイトとして公開

1. VercelへGitHubアカウントでログインします。
2. Add New → Projectで `daichikomotoacumoxfit-lgtm/personalgym` をImportします。リポジトリが表示されなければGitHub連携でこのリポジトリへのアクセスを許可します。公開URLを作るためにソースのリポジトリを公開設定にする必要はありません。
3. Framework PresetがNext.js、Root Directoryがリポジトリ直下であることを確認します。インストールはnpm ci、ビルドはnpm run buildです。
4. Environment Variablesに `CONTENT_MODE=preview` を設定します。CMS接続前の明示的な確認用モードで、指定された初期コンテンツと料金を表示します。検索エンジンには掲載しません。秘密キーは不要です。
5. Deployを実行します。作成された `https://プロジェクト名.vercel.app` が公開URLです。VercelのDeployment Protectionが有効な場合は、その公開先についてVercel Authentication等を無効にし、ログアウト状態・シークレットウィンドウでも開けることを確認します。
6. スマホからも開き、固定CTAとFAQ、STORESへのリンクを確認します。公開URLが未確定の段階では、本物のURLが発行済みとは扱いません。

このモードは確認用です。写真はイメージであり、実際のトレーナーや施設の写真ではありません。口コミや未確定の住所は掲載していません。STORESの最新料金との再照合は別途必要です。

## CMS接続後の正式運用

1. READMEとcms-schema.mdに従ってmicroCMSの5 APIを作成・登録します。
2. Vercelの環境変数を `CONTENT_MODE=cms` に変更し、MICROCMS_SERVICE_DOMAIN、MICROCMS_API_KEY、MICROCMS_WEBHOOK_SECRET、NEXT_PUBLIC_SITE_URL（実際の公開URL）を設定します。秘密値をGitHubやチャットに保存しません。
3. Redeployします。環境変数の変更だけでは古いビルドに反映されません。
4. microCMSの全APIに `https://実際の公開URL/api/revalidate` のWebhookを登録し、秘密ヘッダー `x-webhook-secret` を設定します。
5. 公開・料金更新・非公開・削除を確認します。予約リンクの遷移、掲載許諾、法定表記、STORESの料金を確認し、READMEの公開前チェックリストを完了します。

CLIから配置する場合は、Vercelへログインできる端末で `npx vercel`、正式な公開先へ配置する際に `npx vercel --prod` を実行できます。初期の公開でも環境変数CONTENT_MODE=previewを忘れないでください。本環境にはVercelの認証がなく、認証なしでデプロイ済みとはしていません。
