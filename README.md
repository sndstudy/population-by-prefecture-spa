# population-by-prefecture-spa

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## 概要

- 都道府県別の総人口推移グラフを表示するSPA(Single Page Application)
- 都道府県データ、総人口データは[RESAS-API](https://opendata.resas-portal.go.jp/)から取得

## 技術スタック

- [Node.js](https://nodejs.org/ja/)
  - v18.13.0
- [React](https://ja.reactjs.org/)
  - TypeScript
  - CSS Modules
- [Highcharts](https://www.highcharts.com/)
  - グラフ描画部分で使用
  - [Highcharts React](https://github.com/highcharts/highcharts-react)というラッパーを使用
- AWS
  - CloudFront + S3でSPAを配信

## ローカル環境での動かし方

1. (Node.js未インストールの場合)Node.jsをインストールする
   1. バージョンはv18.x
2. このリポジトリをローカル環境にcloneする
   1. `git clone https://github.com/sndstudy/population-by-prefecture-spa.git`
3. `cd ./population-by-prefecture-spa`でディレクトリを移動する
4. `npm ci`で必要なパッケージをインストールする
5. `.env`ファイルを作成して下記環境変数を設定する
   1. `REACT_APP_RESAS_API_KEY=<RESAS-APIのAPIキー>`
   2. APIキーが無い場合は[RESAS-API](https://opendata.resas-portal.go.jp/)から取得すること
6. `npm start`でアプリを起動する
   1. `http://localhost:3000`にアクセスして都道府県一覧が表示されればOK

## 実装方針

方針としてはContainer/Presentationalパターンで実装を行う

https://www.patterns.dev/posts/presentational-container-pattern/

- Container
  - Presentationalにデータを受け渡す役割
  - 外部APIへのアクセスやstate(状態)を持つ
- Presentational
  - propsを通じて受け取ったデータを表示する
  - 基本的にstate(状態)は持たないがUIのためにstateが必要な時は持つ場合がある

## ディレクトリ構成

`src`ディレクトリ以下の構成について記載する

- `api`
  - APIにアクセスする処理が書かれているソースコードをまとめている
- `container`
  - Container/PresentationalパターンのContainerコンポーネントをまとめている
- `option`
  - Highchartsの設定が書かれているソースコードをまとめている
- `presentational`
  - Container/PresentationalパターンのPresentationalコンポーネントをまとめている
- `styles`
  - スタイルを定義している`*.module.scss`のファイルをまとめている

## CI/CD

CI/CDはGitHub Actionsで行っている

- CI
  - Pull request作成時に実行
  - ESLintのチェック
  - Prettierのチェック
  - Testの実行
- CD
  - `main`ブランチにマージされた時に実行
  - ビルドした後にS3バケットにアップロードされる

## npm-scripts

### `npm start`

開発モードでアプリを実行する。
[http://localhost:3000](http://localhost:3000) にアクセスすると、ブラウザで表示されます。

### `npm test`

テストを実行する。

### `npm run build`

本番用にアプリをビルドする。

### `npm run eslint`

ESLintを実行する。

### `npm run format`

Prettierを実行する。
自動でフォーマットしてファイルを上書きする。

### `npm run format-check`

Prettierを実行する。
Prettierのルールに沿っていない場合はエラーになる。
CIでPrettierのルールに沿ってフォーマットされているか確認するためのスクリプト。
