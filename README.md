# Post LGTM Image

[![last commit](https://img.shields.io/github/last-commit/ddradar/lgtm-action "last commit")](https://github.com/ddradar/lgtm-action/commits/master)
[![release version](https://img.shields.io/github/v/release/ddradar/lgtm-action "release version")](https://github.com/ddradar/lgtm-action/releases)
[![CI/CD](https://github.com/ddradar/lgtm-action/workflows/CI/CD/badge.svg)](https://github.com/ddradar/lgtm-action/actions?query=workflow%3ACI%2FCD)
[![CodeFactor](https://www.codefactor.io/repository/github/ddradar/lgtm-action/badge)](https://www.codefactor.io/repository/github/ddradar/lgtm-action)
[![Dependabot Status](https://api.dependabot.com/badges/status?host=github&repo=ddradar/lgtm-action)](https://dependabot.com)
[![License](https://img.shields.io/github/license/ddradar/lgtm-action)](LICENSE)

Post image if you comment "LGTM"

## Usage

See [action.yml](./action.yml)

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
          token: ${{ secrets.GITHUB_TOKEN }}
          image-url: "{ Your LGTM image URL }"
```

## Options

### token

*Required.*

Set token provided by GitHub Actions. (`${{ secrets.GITHUB_TOKEN }}`)

### image-url

*Required.*

Set your image URL.

## Screenshots

1. Post "LGTM" or "lgtm" issue comment.
  ![Send issue comment](https://raw.githubusercontent.com/ddradar/lgtm-action/images/screenshot_comment.png)
1. Or review comment.
  ![Send review comment](https://raw.githubusercontent.com/ddradar/lgtm-action/images/screenshot_pull_request_review.png)
1. Post LGTM image automatically.
  ![LGTM image post](https://raw.githubusercontent.com/ddradar/lgtm-action/images/screenshot_action_works.png)

## License

[MIT License](./LICENSE)
