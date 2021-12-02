# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [1.1.4](https://github.com/crcarrick/commitmnt/compare/v1.1.3...v1.1.4) (2021-12-02)


### Bug Fixes

* don't release changes @ 2am ([ba26d83](https://github.com/crcarrick/commitmnt/commit/ba26d83327ce16118b7c71b996c399b5fcce4273))

### [1.1.3](https://github.com/crcarrick/commitmnt/compare/v1.1.2...v1.1.3) (2021-12-02)

### [1.1.2](https://github.com/crcarrick/commitmnt/compare/v1.1.1...v1.1.2) (2021-12-02)


### Bug Fixes

* actually commit the cd.go changes ([0ef81f2](https://github.com/crcarrick/commitmnt/commit/0ef81f2bde08008c9ea5093b1a8831440b5b0d32))

### [1.1.1](https://github.com/crcarrick/commitmnt/compare/v1.1.0...v1.1.1) (2021-12-02)

## [1.1.0](https://github.com/crcarrick/commitmnt/compare/v1.0.3...v1.1.0) (2021-12-02)


### Features

* add `ChangeDirectory` to dep injection ([9ec9f94](https://github.com/crcarrick/commitmnt/commit/9ec9f947458f65854af9d141958285d63ff6c69b))
* add `ChangeDirectory` utility class ([d9a1769](https://github.com/crcarrick/commitmnt/commit/d9a1769ed71de9cd483d188bf6d4e75a3784a7ab))


### Bug Fixes

* ensure cache updates are committed & pushed ([a1e4be7](https://github.com/crcarrick/commitmnt/commit/a1e4be7f4b6e4a04b2805391a0c6c94d81fab22c))

### [1.0.3](https://github.com/crcarrick/commitmnt/compare/v1.0.2...v1.0.3) (2021-12-01)

### [1.0.2](https://github.com/crcarrick/commitmnt/compare/v1.0.1...v1.0.2) (2021-12-01)


### Bug Fixes

* **Cache:** use path.resolve instead of path.join ([b885505](https://github.com/crcarrick/commitmnt/commit/b885505e20065c25b3de1cdf2c6c92833d64475f))

### [1.0.1](https://github.com/crcarrick/commitmnt/compare/v1.0.0...v1.0.1) (2021-12-01)


### Bug Fixes

* git push issue ([24217e6](https://github.com/crcarrick/commitmnt/commit/24217e67edf5a2e008406e0680714e8dbd0aac24))

## 1.0.0 (2021-12-01)


### Features

* add `copyRepo` fn to public api ([ab8cc83](https://github.com/crcarrick/commitmnt/commit/ab8cc83b78bdfabc9f96f5aa1e47bcf702821668))
* add final git.push after final cache update ([ce83b22](https://github.com/crcarrick/commitmnt/commit/ce83b22dd9816e5988213234ffe9d9f7b8422ec5))
* expose package api surface ([18d503c](https://github.com/crcarrick/commitmnt/commit/18d503cef7776f921c6e5b2961454c0010b59c2f))
* rename exports and remove default export ([45a97dc](https://github.com/crcarrick/commitmnt/commit/45a97dcfa56cae2385521485a677315380252eb7))
* start porting the code over into typescript and write some tests ([889da77](https://github.com/crcarrick/commitmnt/commit/889da77a22e87efa511b1a5e584672be77cee145))
