# Post LGTM Image

[![last commit](https://img.shields.io/github/last-commit/ddradar/lgtm-action 'last commit')](https://github.com/ddradar/lgtm-action/commits)
[![release version](https://img.shields.io/github/v/release/ddradar/lgtm-action?sort=semver 'release version')](https://github.com/ddradar/lgtm-action/releases)
[![Node.js CI](https://github.com/ddradar/lgtm-action/actions/workflows/nodejs.yml/badge.svg)](https://github.com/ddradar/lgtm-action/actions/workflows/nodejs.yml)
[![codecov](https://codecov.io/gh/ddradar/lgtm-action/branch/main/graph/badge.svg?token=9NHUlO6fhV)](https://codecov.io/gh/ddradar/lgtm-action)
[![CodeFactor](https://www.codefactor.io/repository/github/ddradar/lgtm-action/badge)](https://www.codefactor.io/repository/github/ddradar/lgtm-action)
[![License](https://img.shields.io/github/license/ddradar/lgtm-action)](LICENSE)

日本語版のガイドは[こちら](./README-ja.md)です。

Post image if you comment "LGTM"

## TOC

- [Usage](#usage)
  - [Basic](#basic)
  - [Use with Choose Random Action](#use-with-choose-random-action)
- [Options](#options)
- [Screenshots](#screenshots)
- [License](#license)
- [Contributing](#contributing)

## Usage

See [action.yml](./action.yml)

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
      - uses: ddradar/lgtm-action@v2.0.2
        with:
          image-url: '{ Your LGTM image URL }'
          search-pattern: |
            ^(lgtm|LGTM)$
            ^:\+1:$
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
    if: (!contains(github.actor, '[bot]')) # Exclude bot comment
    steps:
      - uses: ddradar/choose-random-action@v2
        id: act
        with:
          contents: |
            https://example.com/your-lgtm-image-1.jpg
            https://example.com/your-lgtm-image-2.jpg
            https://example.com/your-lgtm-image-3.jpg
      - uses: ddradar/lgtm-action@v2.0.2
        with:
          image-url: ${{ steps.act.outputs.selected }}
```

## Options

| Name           | Required? | Description                                                                                                   | Default               |
| -------------- | :-------: | :------------------------------------------------------------------------------------------------------------ | --------------------- |
| image-url      |    Yes    | Set your image URL                                                                                            | -                     |
| search-pattern |    No     | Set regexp pattern this action reacts.<br />This action uses Multi-line(`RegExp.prototype.multiline`) search. | `^(lgtm\|LGTM)$`      |
| token          |    No     | GitHub Access Token to post issue comment. (requires `issues:write` permission)                               | `${{ github.token }}` |

## Screenshots

1. Post "LGTM" or "lgtm" issue comment.
   ![Send issue comment](https://raw.githubusercontent.com/ddradar/lgtm-action/main/images/screenshot_comment.png)
1. Or review comment.
   ![Send review comment](https://raw.githubusercontent.com/ddradar/lgtm-action/main/images/screenshot_pull_request_review.png)
1. Post LGTM image automatically.
   ![LGTM image post](https://raw.githubusercontent.com/ddradar/lgtm-action/main/images/screenshot_action_works.png)

## License

[MIT License](LICENSE)

## Contributing

See [guide](CONTRIBUTING.md).
