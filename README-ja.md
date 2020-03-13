# Post LGTM Image

[![last commit](https://img.shields.io/github/last-commit/ddradar/lgtm-action "last commit")](https://github.com/ddradar/lgtm-action/commits/master)
[![release version](https://img.shields.io/github/v/release/ddradar/lgtm-action "release version")](https://github.com/ddradar/lgtm-action/releases)
[![CI/CD](https://github.com/ddradar/lgtm-action/workflows/CI/CD/badge.svg)](https://github.com/ddradar/lgtm-action/actions?query=workflow%3ACI%2FCD)
[![codecov](https://codecov.io/gh/ddradar/lgtm-action/branch/master/graph/badge.svg)](https://codecov.io/gh/ddradar/lgtm-action)
[![CodeFactor](https://www.codefactor.io/repository/github/ddradar/lgtm-action/badge)](https://www.codefactor.io/repository/github/ddradar/lgtm-action)
[![Dependabot Status](https://api.dependabot.com/badges/status?host=github&repo=ddradar/lgtm-action)](https://dependabot.com)
[![License](https://img.shields.io/github/license/ddradar/lgtm-action)](LICENSE)

English guide is [here](./README.md).

"LGTM" コメント時に画像を投稿します。

## TOC

- [使い方](#usage)
- [オプション](#options)
  - [image-url](#image-url)
  - [search-pattern](#search-pattern)
  - [token](#token)
- [スクリーンショット](#screnshots)
- [ライセンス](#license)
- [プロジェクトへの貢献](#contributing)

## Usage

[action.yml](./action.yml)をご覧ください。

```yaml
name: Send LGTM Image
on:
  issue_comment:
    types: [created]
  pull_request_review:
    types: [submitted]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: ddradar/lgtm-action@v1
        with:
          image-url: "{ Your LGTM image URL }"
          search-pattern: |
            ^(lgtm|LGTM)$
            ^:\+1:$
            ^(ヨシ|ﾖｼ)(!|！)?$
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
  ![Send issue comment](https://raw.githubusercontent.com/ddradar/lgtm-action/master/images/screenshot_comment.png)
1. またはレビューにコメントします。
  ![Send review comment](https://raw.githubusercontent.com/ddradar/lgtm-action/master/images/screenshot_pull_request_review.png)
1. LGTM画像が自動的に投稿されます。
  ![LGTM image post](https://raw.githubusercontent.com/ddradar/lgtm-action/master/images/screenshot_action_works.png)

## License

[MIT ライセンス](LICENSE)

## Contributing

[ガイド](CONTRIBUTING-ja.md)をご覧ください。
