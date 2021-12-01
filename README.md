# Commitment (cmytment)

Do you work for a company that uses Gitlab or Bitbucket? Are you trying to find a job and worried that your cold, barren husk of a Github activity graph will hold you back? Commitment is a node.js library that helps you copy your commit history from other repositories into a new repository you can then push up to Github.

There are several projects floating around Github that will _fake_ you a commit history in a fresh repo, but that seemed bogus and so this library was born. **No data is leaked from the source repos other than the dates of your commits.**

## Setup

```bash
# create a new project
mkdir work-history
cd work-history

# initialize a fresh git repo
git init

# install the library
yarn init
yarn add cmytment
touch index.js
```

## Usage

The library exposes two functions to help you copy commits from your source repos to your destination repo.

### `cmytment(config: Config, options: Options)`

This is the default export of the library and is intended to be a quick and easy solution to copy commits from a list of source repos.

##### Setup & Usage

```typescript
// in index.js
import cmytment from 'cmytment';

async function main() {
  const config = {
    branch: 'main',
    repositories: [
      {
        author: 'Chris Carrick',
        branch: 'main',
        path: '/Users/chriscarrick/Projects/project1',
      },
      {
        author: 'Chris Carrick',
        branch: 'main',
        path: '/Users/chriscarrick/Projects/project1',
      },
    ]
    rootDir: process.cwd(),
  };

  await cmytment(config); // done 😃
}

main();
```

That's pretty much it. The library will take the list of repositories you specified in your `config`, read all the commits you made and re-make those same commits in your current repository.

### `initCmytment(config: Config)`

This is a "lower level" export that takes some configuration and returns you some utilities you can use to read and copy commits from your source repos. These utilities are exposed to help you in case you want to do something a little unique (eg. only copy commits that occur on weekdays).

##### Setup

```typescript
import { initCmytment } from 'cmytment';

async function main() {
  const config = {
    branch: 'main',
    rootDir: process.cwd(),
  };

  const { getCommitsForRepo, copyCommitsToRepo, copyRepo } = await initCmytment(config);
}

main();
```

##### Usage

The following is an example of combining the provided utilities to only copy commits from a source repo that occurred on weekdays.

```typescript
import { initCmytment } from 'cmytment';
import { isWeekend } from 'date-fns';

async function main() {
  const config = {
    branch: 'main',
    rootDir: process.cwd(),
  };

  const { getCommitsForRepo, copyCommitsToRepo } = await initCmytment(config);

  const commitDates = await getCommitsForRepo({
    author: 'Chris Carrick',
    branch: 'main',
    path: '/Users/chriscarrick/Projects/project1',
  });

  const weekdayCommits = commitDates.filter((date) => !isWeekend(new Date(date)));

  await copyCommitsToRepo(weekdayCommits); // done 😃
}

main();
```
