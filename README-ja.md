# Post LGTM Image

[![last commit](https://img.shields.io/github/last-commit/ddradar/lgtm-action "last commit")](https://github.com/ddradar/lgtm-action/commits)
[![release version](https://img.shields.io/github/v/release/ddradar/lgtm-action "release version")](https://github.com/ddradar/lgtm-action/releases)
[![Node.js CI](https://github.com/ddradar/lgtm-action/actions/workflows/nodejs.yml/badge.svg)](https://github.com/ddradar/lgtm-action/actions/workflows/nodejs.yml)
[![codecov](https://codecov.io/gh/ddradar/lgtm-action/branch/main/graph/badge.svg?token=9NHUlO6fhV)](https://codecov.io/gh/ddradar/lgtm-action)
[![CodeFactor](https://www.codefactor.io/repository/github/ddradar/lgtm-action/badge)](https://www.codefactor.io/repository/github/ddradar/lgtm-action)
[![License](https://img.shields.io/github/license/ddradar/lgtm-action)](LICENSE)

English guide is [here](./README.md).

"LGTM" コメント時に画像を投稿します。

## TOC

- [使い方](#usage)
  - [基本](#basic)
  - [Choose Random Actionと使う](#use-with-choose-random-action)
- [オプション](#options)
  - [image-url](#image-url)
  - [search-pattern](#search-pattern)
  - [token](#token)
- [スクリーンショット](#screenshots)
- [ライセンス](#license)
- [プロジェクトへの貢献](#contributing)

## Usage

[action.yml](./action.yml)をご覧ください。

### Basic

```yaml
name: Send LGTM Image
on:
  issue_comment:
    types: [created]
  pull_request_review:
    types: [submitted]
jobs:
  post:
    runs-on: ubuntu-latest
    steps:
      - uses: ddradar/lgtm-action@v2.0.0
        with:
          image-url: "{ Your LGTM image URL }"
          search-pattern: |
            ^(lgtm|LGTM)$
            ^:\+1:$
            ^(ヨシ|ﾖｼ)(!|！)?$
```

### Use with [Choose Random Action](https://github.com/ddradar/choose-random-action)

```yaml
name: Send Random LGTM Image
on:
  issue_comment:
    types: [created]
  pull_request_review:
    types: [submitted]
jobs:
  post:
    runs-on: ubuntu-latest
    if: (!contains(github.actor, '[bot]'))  # botのコメントを除く
    steps:
      - uses: ddradar/choose-random-action@v1
        id: act
        with:
          contents: |
            https://example.com/your-lgtm-image-1.jpg
            https://example.com/your-lgtm-image-2.jpg
            https://example.com/your-lgtm-image-3.jpg
      - uses: ddradar/lgtm-action@v2.0.0
        with:
          image-url: ${{ steps.act.outputs.selected }}
```

## Options

### image-url

*必須です。*

画像URLをセットします。

### search-pattern

*オプション。*

このアクションが反応する正規表現パターンをセットします。
複数行検索(`RegExp.prototype.multiline`)を行います。

未指定の場合は、`^(lgtm|LGTM)$`がセットされます。

### token

*オプション。*

issue にコメントするために使用する、GitHub のアクセストークン。
通常、指定する必要はありません。(GitHub Actions から提供されます。)

トークンには `issues:write` 権限が必要です。

未指定の場合は、`${{ github.token }}`がセットされます。

## Screenshots

1. issue に "LGTM" または "lgtm" とコメントします。
  ![Send issue comment](https://raw.githubusercontent.com/ddradar/lgtm-action/main/images/screenshot_comment.png)
1. またはレビューにコメントします。
  ![Send review comment](https://raw.githubusercontent.com/ddradar/lgtm-action/main/images/screenshot_pull_request_review.png)
1. LGTM画像が自動的に投稿されます。
  ![LGTM image post](https://raw.githubusercontent.com/ddradar/lgtm-action/main/images/screenshot_action_works.png)

## License

[MIT ライセンス](LICENSE)

## Contributing

[ガイド](CONTRIBUTING-ja.md)をご覧ください。
