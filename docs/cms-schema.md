# microCMS APIスキーマ

microCMS管理画面で手動作成するための仕様です。インポート用の内部スキーマJSONではありません。標準の「テキスト」「テキストエリア」「数値」「真偽値」「画像」「セレクトフィールド」「カスタムフィールド」「繰り返しフィールド」を使用します。配列を自由なJSONフィールドとして登録しないでください。

## API一覧

| API名 | エンドポイント | 形式 |
|---|---|---|
| LPの文章と写真 | `lp` | オブジェクト形式（単一データ） |
| 店舗・トレーナー設定 | `site-settings` | オブジェクト形式 |
| 料金プラン | `plans` | リスト形式 |
| お客様の声 | `testimonials` | リスト形式 |
| よくある質問 | `faqs` | リスト形式 |

公開ページの取得キーは全5 APIのGET権限のみを許可してください。更新・登録用のキーをブラウザや公開リポジトリに置かないでください。

## 共通カスタムフィールド

管理画面のカスタムフィールドから次の2つを作成します。カスタムフィールドIDは `item` と `section`。`item` を先に作成してください。表示名は日本語にします。繰り返しフィールドは使用可能なカスタムフィールドを `item` に限定します。画像のaltには同じ項目の見出しを使います。Heroには仕事終わりの街を歩く人物のイメージを設定してください。

### 項目（item）

| フィールドID | 日本語のフィールド名 | 型 | 必須 |
|---|---|---|---|
| title | 項目の見出し | テキスト | 必須 |
| text | 項目の説明 | テキストエリア | 任意 |
| label | 英字ラベル | テキスト | 任意 |
| image | 項目の写真 | 画像 | 任意 |

### セクション（section）

| フィールドID | 日本語のフィールド名 | 型 | 必須 |
|---|---|---|---|
| visible | このセクションを表示する | 真偽値 | 必須 |
| eyebrow | 上部の英字見出し | テキスト | 任意 |
| title | 日本語の大きな見出し | テキストエリア | 必須 |
| body | 説明文 | テキストエリア | 任意 |
| closing | 締めの説明文 | テキストエリア | 任意 |
| image | メイン写真 | 画像 | 任意 |
| items | 項目の一覧 | 繰り返しフィールド（item） | 任意 |
| cta | このセクションに予約ボタンを表示する | 真偽値 | 必須 |

Heroのボタン文言・料金・時間はplansから生成します。固定ヘッダー・モバイル固定CTAはセクションのcta設定にかかわらず表示します。固定メニュー内のリンクは対象セクションが表示される場合だけ表示します。

## lp

以下はすべて型「カスタムフィールド（section）」・任意です。未登録・非表示のセクションは安全に隠れます。各セクションの `visible` は初期登録時にオンにしてください。APIレスポンスの各セクション内には `fieldId: "section"`、各項目には `fieldId: "item"` が含まれます。

| フィールドID | 日本語のフィールド名 | 対応箇所 |
|---|---|---|
| `hero` | トップの文章とメイン写真 | DESK WORKERS / BODY CARE & TRAINING |
| `trialOffer` | 初回体験の説明 | FIRST SESSION |
| `painPoints` | デスクワーカーのお悩み | DOES THIS SOUND FAMILIAR? |
| `desiredFuture` | 仕事終わりに目指す暮らし | LIFE AFTER WORK |
| `integratedApproach` | 整体と運動の組み合わせ | CARE & TRAINING |
| `benefits` | 選ばれる理由 | WHY CHOOSE US |
| `testimonials` | お客様の声の見出し | REAL STORIES |
| `services` | サービス一覧 | OUR SERVICES |
| `pricing` | 料金の見出しと補足 | PLANS & PRICING |
| `trialFlow` | 初回体験の流れ | HOW IT WORKS |
| `trainerProfile` | トレーナー紹介の見出し | ABOUT THE TRAINER |
| `accessAndFAQ` | アクセスとFAQの見出し | ACCESS & FAQ |
| `finalCTA` | 最後の予約案内 | YOUR LIFE. / AFTER WORK. |

- desiredFuture.items：4件を基本に、料理・街歩き・運動・休日の各写真と文章を登録します。PCは2列、スマホは1列です。増減可能です。
- integratedApproach.items：整体・トレーニング・組み合わせの3件。最初の2件に写真を設定します。
- services.items：BODY CARE等4件。labelに英字、titleに日本語、textに説明、imageに写真を登録します。
- testimonials：表示設定がオンでも、公開対象の口コミが0件なら自動非表示です。
- trainerProfile：見出しはlp、人物情報はsite-settingsを編集します。実際の人物写真がなければタイポグラフィを表示します。イメージモデルを本人として使いません。
- pricing：見出しと補足のみ。金額をここに書き込まずplansを編集してください。
- 改行はテキストエリアにそのまま入力します。HTML・リッチエディタは使いません。英語の装飾文字・ナビ名・共通UIラベルはデザインとしてコードに固定しています。

## site-settings

| フィールドID | 日本語のフィールド名 | 型 | 必須 |
|---|---|---|---|
| `storeName` | 正式な店舗名 | テキスト | 任意 |
| `concept` | ブランドコンセプト | テキスト | 任意 |
| `bookingUrl` | すべての体験予約ボタンのリンク先 | テキスト | 必須 |
| `lineUrl` | LINEのURL | テキスト | 任意 |
| `instagramUrl` | InstagramのURL | テキスト | 任意 |
| `threadsUrl` | ThreadsのURL | テキスト | 任意 |
| `address` | 確定した実際の提供場所の住所 | テキスト | 任意 |
| `nearestStation` | 最寄り駅 | テキスト | 任意 |
| `walkingMinutes` | 駅からの徒歩分数 | 数値 | 任意 |
| `hours` | 営業時間 | テキスト | 任意 |
| `closedDays` | 定休日 | テキスト | 任意 |
| `phone` | 電話番号 | テキスト | 任意 |
| `serviceLocation` | 提供場所の説明 | テキスト | 任意 |
| `areas` | 対応エリア（1行1件） | テキストエリア | 任意 |
| `bookingGuidance` | 予約確定後の案内文 | テキストエリア | 任意 |
| `belongings` | お持ち物 | テキスト | 任意 |
| `trainerName` | トレーナーのお名前 | テキスト | 任意 |
| `trainerPhoto` | トレーナーご本人の写真 | 画像 | 任意 |
| `qualifications` | 保有資格・活動（1行1件） | テキストエリア | 任意 |
| `career` | これまでの経歴 | テキストエリア | 任意 |
| `biography` | 自己紹介文 | テキストエリア | 任意 |
| `privacyPolicy` | 確認済みのプライバシーポリシー本文 | テキストエリア | 任意 |
| `legalUrl` | 必要な法定表記の公開ページURL | テキスト | 任意 |

住所は予約サイトの事業者登録住所を転記しないでください。実際に提供している場所の確定情報のみ入力してください。未入力項目は表示しません。bookingUrlと外部リンクはHTTPS URLのみ使用できます。

## plans

コンテンツIDがプランIDです。`id`という追加フィールドは作成しません。

| フィールドID | 日本語のフィールド名 | 型 | 必須 |
|---|---|---|---|
| name | プラン名 | テキスト | 必須 |
| category | 区分 | セレクト（複数選択オフ） | 必須 |
| price | 税込料金（円） | 数値 | 必須 |
| regularPrice | 比較用の通常税込料金（円） | 数値 | 任意 |
| duration | 1回の所要時間（分） | 数値 | 必須 |
| sessions | 回数券の回数 | 数値 | 任意 |
| description | プランの内容 | テキストエリア | 任意 |
| order | 表示順 | 数値 | 必須 |
| published | サイトに表示する | 真偽値 | 必須 |
| bookingUrl | 個別STORES URL（無料相談用） | テキスト | 任意 |

categoryの選択肢は `trial`（初回体験）、`regular`（通常）、`ticket`（回数券）、`consultation`（無料相談）。microCMSのセレクト応答は配列になるため、コードで先頭の選択値に正規化します。金額は0以上、時間・回数は正数を入力してください。trialは1件だけ公開してください。複数ある場合は表示順が最初のものを初回体験として参照します。

メインの体験CTAはすべてsite-settings.bookingUrlを使います。個別bookingUrlは無料相談の補助リンクだけに使用します。

## testimonials

| フィールドID | 日本語のフィールド名 | 型 | 必須 |
|---|---|---|---|
| age | 年代 | テキスト | 任意 |
| occupation | 職業 | テキスト | 任意 |
| period | 利用期間 | テキスト | 任意 |
| comment | ご本人の感想 | テキストエリア | 必須 |
| image | 掲載許諾済みの写真 | 画像 | 任意 |
| order | 表示順 | 数値 | 必須 |
| published | サイトに表示する | 真偽値 | 必須 |

掲載許諾のある実際の声のみ登録してください。初期データは0件です。実績・口コミは補完しません。

## faqs

| フィールドID | 日本語のフィールド名 | 型 | 必須 |
|---|---|---|---|
| question | ご質問 | テキスト | 必須 |
| answer | ご回答 | テキストエリア | 必須 |
| order | 表示順 | 数値 | 必須 |
| published | サイトに表示する | 真偽値 | 必須 |

API側のコンテンツ公開に加え、publishedをオンにします。非公開・削除・publishedオフのいずれでも更新通知でページから除外されます。

## 標準機能の参照先

- カスタムフィールド：https://document.microcms.io/manual/custom-field
- 繰り返しフィールド：https://document.microcms.io/manual/repeat-field
- Webhook：https://document.microcms.io/manual/webhook-setting
- JavaScript SDK：https://github.com/microcmsio/microcms-js-sdk

本環境には管理画面の権限・実サービスの接続情報がありません。上記は標準フィールドによる設定仕様で、実サービス上での作成・取得・更新は未検証です。存在未確認の管理APIによるスキーマ自動作成は実装していません。
