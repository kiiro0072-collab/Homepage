// ============================================================
// マタクアカウント - 設定ファイル
// ============================================================
// 【重要】サイトがHTTPSで配信されている場合、http:// のAPIは
// ブラウザにブロックされます（混在コンテンツ）。
// その場合は worker/index.js をCloudflare Workersにデプロイし、
// 発行された https://〜.workers.dev のURLを以下に設定してください。
// ============================================================

// ローカルテスト用（pageフォルダで npm start した場合）:
// const API_BASE_URL = 'http://n3.host.ringonw.com:3396';

// 本番用（Cloudflare Workersプロキシ）:
const API_BASE_URL = 'https://matakusrvsyuin.kiiro0072.workers.dev';
