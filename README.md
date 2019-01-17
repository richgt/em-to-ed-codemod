# em-to-ed-codemod [![Build Status](https://travis-ci.org/patocallaghan/em-to-ed-codemod.svg?branch=master)](https://travis-ci.org/patocallaghan/em-to-ed-codemod)


A collection of codemod's for em-to-ed-codemod.

## Usage

To run a specific codemod from this project, you would run the following:

```
npx github:patocallaghan/em-to-ed-codemod <TRANSFORM NAME> path/of/files/ or/some**/*glob.js
```

## Transforms

<!--TRANSFORMS_START-->
* [em-to-ed](transforms/em-to-ed/README.md)
<!--TRANSFORMS_END-->

## Contributing

### Installation

* clone the repo
* change into the repo directory
* `yarn`

### Running tests

* `yarn test`
* `yarn test:watch` for live-reloading
* For debugging, install [ndb](https://www.npmjs.com/package/ndb) and run `ndb yarn test:watch`

### Update Documentation

* `yarn update-docs`