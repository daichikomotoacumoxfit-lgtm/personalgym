# 整体 × パーソナルトレーニング LP

「仕事終わりに、好きなことを楽しめる身体へ。」を軸にした、モノクロームの集客LPです。Next.js App Router / TypeScript / Tailwind CSS v4 / microCMS / lucide-react。参考画像のブランドや写真は使用していません。

## 1. 起動する

Node.js 22以上（検証環境24.22.1）を使用します。

```sh
cd /workspace/personalgym
npm ci
npm run dev
```

CMS変数が両方未設定の開発サーバーでは、指示書の文章と料金を使うローカルプレビューが表示されます。`.env.example` を `.env.local` にコピーして設定できます。既存のファイルは上書きしないでください。

```sh
npm run typecheck
npm run lint
npm test
CONTENT_MODE=preview npm run build
# 本番モードの安全な停止表示とWebhook認証
node scripts/verify-production.mjs
CONTENT_MODE=preview npm start
# ブラウザ検証（起動中サーバー + Chromiumが必要）
npm run test:browser
```

ビルドは、このクラウド環境で利用可能なWebpackを使用します。ブラウザテストは `/usr/bin/chromium` を使用します。他の環境ではplaywright.config.tsのexecutablePathを環境のChromiumへ変更するか、Playwright管理ブラウザをインストールしてその指定を削除してください。

### プレビューと本番の分離

- 開発時：CMS未設定なら初期データ。CMSを試すときはCONTENT_MODEを削除するか `cms` にします。
- `CONTENT_MODE=preview`：本番形式のローカル動作確認にも使える明示的なデザインプレビュー。noindex、robots拒否、sitemap空です。
- 公開時：`CONTENT_MODE=cms`、CMSのドメイン・キー・Webhook秘密値と `NEXT_PUBLIC_SITE_URL=https://実際の公開ドメイン` を設定してビルド・起動してください。`preview` のまま公開しないでください。
- CMS未設定・取得失敗では初期データに切り替えません。確認中画面とnoindexになります。壊れたAPIで架空の口コミや古い仮料金を表示し続けません。
- 正常取得を300秒キャッシュします。時間ベース再取得はstale-while-revalidateで、取得後600秒を超えたデータは表示しません。Webhook認証成功時は直ちにキャッシュを無効化し、次の表示で取得します。

## 2. microCMSサービスを作成する

microCMSにログインしてサービスを作成し、サービスIDを控えます。作成操作を行う権限はユーザー側で必要です。このリポジトリを実装しただけではサービスやAPIは作成されません。

## 3. APIスキーマを作成する

[日本語フィールド一覧](docs/cms-schema.md)のとおり、共通カスタムフィールド `item` → `section` の順に作り、次のAPIを作成します。

| API | 形式 | 編集対象 |
|---|---|---|
| lp | オブジェクト | 各セクションの見出し・本文・写真・表示設定 |
| site-settings | オブジェクト | 店舗・アクセス・トレーナー・予約URL |
| plans | リスト | 全料金・時間・プラン名 |
| testimonials | リスト | 許諾済みの実際の口コミ |
| faqs | リスト | 質問と回答 |

初期コンテンツは [src/content/initial.json](src/content/initial.json) に集約しています。React内へ営業コピーを直接埋め込んでいません。`npm run cms:export` で `.cms-export/` にAPIごとのJSONを出力できます。これはオフラインの転記補助です。API作成やデータ登録、写真アップロードを自動実行しません。JSON形式がmicroCMS管理画面の一括インポートに対応するとは主張していません。必要な本文を各フィールドへ転記してください。

画像は別途microCMSメディアへアップロードし、フィールドから選択します。エクスポートJSONはローカル画像を除外し、対応一覧をimages.jsonへ出力します。必要に応じて、内容を確認して正式なContent APIで登録する独立した運用を行ってください。公開サイトのGET専用キーで登録処理を実行しないでください。

## 4. APIキーを設定する

microCMSのAPIキー設定で、5 APIのGETを許可したキーを作成します。

```dotenv
MICROCMS_SERVICE_DOMAIN=サービスIDのみ（.microcms.ioは付けない）
MICROCMS_API_KEY=管理画面で発行したキー
MICROCMS_WEBHOOK_SECRET=十分に長いランダムな秘密値
NEXT_PUBLIC_SITE_URL=https://実際の公開ドメイン
CONTENT_MODE=cms
```

秘密値をチャット・Git・公開変数へ書かないでください。ホスティング先の環境変数へ安全に入力します。コードはサーバー側SDKのみでCMSに接続します。鍵の変数にNEXT_PUBLIC_を付けません。変数変更後はサーバーを再起動し、本番では再デプロイしてください。

ネットワーク制限のある環境では `サービスID.microcms.io` と `images.microcms-assets.io` が必要です。予約ページの照合には `komotodaichi.stores.jp` が必要です。

## 5. Webhookを設定する

各API（5つすべて）のWebhook設定で以下を登録します。

- 通知先：`https://実際の公開ドメイン/api/revalidate`
- メソッド：POST
- カスタムHTTPヘッダー名：`x-webhook-secret`
- 値：サーバーのMICROCMS_WEBHOOK_SECRETと同じ秘密値
- タイミング：公開・更新・公開終了／非公開・削除。予約公開など運用で利用するイベントも有効にします。

URLのクエリ文字列へ秘密値を置かないでください。Webhookの本文には依存しません。全APIの共有キャッシュとページを無効化するため、削除や非公開も反映されます。秘密値未設定・不一致は401、成功は `{"revalidated":true}`。microCMSからの通知履歴で200を確認した後、サイトを再読込して確認します。Webhook未設定時も通常300秒で再取得します。

## 6. 文章を変更する

microCMS「LPの文章と写真」→ 対象セクション（例：トップの文章とメイン写真）→「日本語の大きな見出し」「説明文」を編集して公開します。改行は入力どおり反映します。「このセクションを表示する」をオフにすると非表示。英字ナビ名・装飾タイポ・共通UIラベルはデザインのためコード管理です。

## 7. 写真を変更する

Heroは `lp.hero.image`（メイン写真）、暮らしの写真は `lp.desiredFuture.items` の各「項目の写真」、サービス写真は `lp.services.items`、整体・運動写真は `lp.integratedApproach.items`、ご本人の写真は `site-settings.trainerPhoto` を編集します。microCMS画像はNext/Imageで配信最適化します。代替テキストは項目の見出しを使用します。

同梱の3画像は制作したイメージ写真です。本人・実店舗・実際の施術実績を示すものではありません。プレビュー用の4枚組写真はCSSで個別に切り出して表示しています。CMSでは各項目に1枚ずつの実写真を設定してください。イメージモデルをトレーナー本人の写真として登録しないでください。画像の掲載権と被写体の許諾を確認します。正式素材がなければ人物写真欄を空にするとタイポグラフィを表示します。

## 8. 料金を変更する

「料金プラン」→ 対象レコード →「税込料金」「通常税込料金」「所要時間」を編集して公開。「サイトに表示する」もオンにします。初回体験は区分 `trial` の1件です。Hero・体験案内・料金・固定CTA・最終CTAは同じレコードを参照します。数字を本文や見出しへ手入力している場合（例：90分の体験から）は、その文章も変更します。

新規プランはレコードを追加し、区分と表示順を指定するだけで表示されます。回数券は回数を入力すると単価を計算します。月額プランは初期登録していません。鍼灸を提供メニューとして掲載していません。

## 9. お客様の声を追加する

「お客様の声」→ 新規作成 → 年代・職業・利用期間・感想・任意の許諾済み写真・表示順を入力 →「サイトに表示する」をオン → 公開。実際の声だけを使用します。0件ならセクション自体が表示されません。掲載を取りやめるときは非公開、削除、または表示設定をオフにします。

## 10. FAQを編集する

「よくある質問」の質問・回答を変更して公開。表示順の小さい順に並びます。項目追加・削除もコード変更不要です。ブラウザ標準の開閉UIを利用し、Enter・Space・Tabに対応します。

## 11. 予約URLを変更する

「店舗・トレーナー設定」→「すべての体験予約ボタンのリンク先」（bookingUrl）を変更して公開。HTTPSのみ。ヘッダー・全セクション・モバイル固定ボタンへ反映します。別タブで開きます。無料相談だけ個別URLがある場合は該当プランのbookingUrlを設定し、なければ同じ予約メニュー一覧に遷移します。

プロフィールのSNSは「店舗・トレーナー設定」の `lineUrl`、`instagramUrl`、`threadsUrl` に各プロフィールのHTTPS URLを入力します。設定済みのリンクだけがトレーナー紹介とフッターに表示されます。

## 12. 更新が反映されない場合

1. 編集内容が下書きではなく公開済みか確認します。
2. API ID・フィールドIDがスキーマ一覧と完全一致しているか確認します。
3. セクションのvisible／レコードのpublishedがオンか確認します。
4. CONTENT_MODE=previewではローカル初期データが表示されます。CMSモードへ変更して再起動します。
5. Webhook通知履歴のステータスを確認。401は秘密値・ヘッダー名、404は公開先URLを確認します。
6. APIキーのGET権限、ドメイン、ネットワーク制限、取得エラーのサーバーログを確認します。APIキーの値をログへ出さないでください。
7. Webhookがない場合は通常300秒後に再取得します。CMS障害が続き600秒を超えた場合は確認中画面になります。

## 13. 計測

`window.dataLayer` へ `page_view`、`cta_click`、`booking_link_click`、`faq_open` を送ります。クリックイベントに `cta_location` と `link_url` を含めます。GTMやGA4を導入する際にカスタムイベントとパラメーターを接続してください。現在、外部計測スクリプトは送信していません。

STORESの外部ページで予約が完了したことは検知できないため、`trial_booking_complete` は発火しません。クリックを完了として扱いません。page_viewをGTM側でも自動送信する場合は重複を避ける設定をしてください。

## 14. 公開前チェックリスト

- [ ] microCMS全5 APIを作成し、実サービスで取得・更新・非公開・削除を確認した
- [ ] CONTENT_MODE=cms、公開URLを設定し、再ビルドした
- [ ] 初回90分4,500円（通常9,500円）、通常60分6,500円・90分9,500円、5回券30,000円・45,000円、無料相談30分をSTORESの最新メニューと再照合した
- [ ] 予約リンクを開き、実際に希望日時を選択できることを確認した
- [ ] 店舗名・営業時間・写真・資格・経歴・対応エリアを本人が確認した
- [ ] レンタルジムの提供場所と事業者登録住所を混同していない
- [ ] 確定したプライバシーポリシーをsite-settings.privacyPolicyへ登録し、必要な法定表記のURLをlegalUrlへ登録した
- [ ] 鍼灸師・あん摩マッサージ指圧師の資格表示や広告に関する適用法令・ガイドラインを確認した
- [ ] 効果保証・架空の口コミ・実績・キャンペーンを掲載していない
- [ ] 口コミと人物写真の掲載許諾を確認した
- [ ] Webhookの公開・非公開・削除イベントが200を返し、次回表示で反映される
- [ ] スマホの固定CTAが本文を隠さず、キーボード操作とFAQが機能する
- [ ] title・OGP・canonical・robots・sitemapを実公開URLで確認した
- [ ] APIキーがブラウザのHTML・JavaScriptへ含まれていない
- [ ] build・lint・typecheck・テストが成功し、公開環境のCore Web Vitalsを計測した

## 現時点の外部確認

STORESのURLは環境のプロキシから403で取得を拒否されたため、最新メニューとの再照合は未完了です。料金はユーザーの最終指示書に明記された値だけを使用しています。microCMSの実サービス設定・実データのWebhook更新、本番公開と新しいタスクへの環境復元は未検証です。

## Web上で一般公開する

Vercelでの公開手順は [docs/deployment.md](docs/deployment.md) を参照してください。CMS未接続の確認用公開と、CMS接続後の正式公開を区別しています。クラウド開発環境の公開だけではWebサイトは一般公開されません。

現在の初回体験CTAは `https://komotodaichi.stores.jp/reserve/honten-go0hwc/2909115/book/course_type?courseCanonicalId=1199180`、無料WEBカウンセリングは `https://komotodaichi.stores.jp/reserve/honten-go0hwc/2909115/book/course_type?courseCanonicalId=951146` に直接移動し、それぞれ対応するメニューが選択された状態で表示されます。CMSへ移行する際もこの設定を引き継いでください。
