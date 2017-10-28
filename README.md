# ryml

[![Build Status](https://travis-ci.org/suzuki-shunsuke/ryml.svg?branch=master)](https://travis-ci.org/suzuki-shunsuke/ryml)
[![npm version](https://badge.fury.io/js/ryml.svg)](https://badge.fury.io/js/ryml)

A command line tool to do HTTP request.
`ryml` enables you to write request parameters with yaml and frees you from annoying escaping.

## Requirements

* Node.js

## Install

```
$ npm i -g ryml
```

## Usage

Call ryml with no argument.

```
$ ryml
```

Then the text editor opens so you write request parameters with yaml.

Instead of the text editor, `ryml` can also accept the standard input.

```
cat << END | ryml
url: http://example.com
method: get
END
```

## Parameters

Internally, `ryml` uses [axios](https://github.com/axios/axios) for the HTTP request,
and the parameters is passed to the `axios` function.
About the parameters, see [here](https://github.com/axios/axios#request-config).

## --quiet option

When you use the text editor to pass the request parameters,
you can't run the same command using command histories.
So by default `ryml` outputs the command you will run.
If you don't like this output, pass the `--quiet (-q)` option.

```
$ ryml -q
```

## Environment Variables Replacing

`ryml` replaces the environment variable name to the environment value.
For example, if the environment variable `PASSWORD` is `hogehoge`, `ryml` replaces the parameters

```yaml
params:
  password: $PASSWORD
```

to

```yaml
params:
  password: hogehoge
```

## Licence

[MIT](LICENSE)

## Author

[Suzuki Shunsuke](https://github.com/suzuki-shunsuke)
