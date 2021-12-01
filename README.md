# Commitment (cmytment)

Do you work for a company that uses Gitlab or Bitbucket? Are you worried that people are looking at your cold, barren husk of a Github activity graph and judging you? Wondering if you even still code anymore? Commitment is a node.js library that helps you copy your commit history from a list of source repositories into a new repository you can then push up to Github.

There are several projects floating around Github that will _fake_ you a commit history in a fresh repo, but that seemed bogus and so this library was born. **No data is leaked from the source repos other than the dates of your commits.** Once you copy the commits from your source repos to your new repo, you can then push the new repo up to Github and make it private (or don't!) and bingo. You now have a big green beautiful **accurate** activity graph.

## Installation & Setup

```
# create a new project
mkdir work-history
cd work-history

# initialize a fresh git repo
git init

# install the library
yarn init
yarn add cmytment

touch index.js && code ./
```

## Usage

The library exposes two functions to help you copy commits from your source repos to your destination repo.

### Basic

`cmytment(config, options)` is the default export of the library and is intended to be a quick and easy solution to copy commits from a list of source repos.

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

### Advanced

`initCmytment(config)` is a "lower level" export that takes some configuration and returns you some utilities you can use to read and copy commits from your source repos. These utilities are exposed to help you in case you want to do something a little different (eg. only copy commits that occur on weekdays).

The following is an example of combining the provided utilities to only copy commits from a source repo that occurred on weekdays.

```typescript
// in index.js
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

### Configuration

#### `cmytment(config, options)`

```typescript
interface Config {
  repositories: Repository[]; // a list of source repos to copy from
  branch: string; // the branch of the current repo to commit to
  path: string; // an *absolute* path to the current directory
}

interface Options {
  quiet: boolean; // option to silence progress output from the library
}

interface Repository {
  author: string; // some identifier to identify your commits by (eg. "Chris Carrick" or "chris@crcarrick.dev")
  branch: string; // the branch of the source repo to copy commits from
  path: string; // an *absolute* path to the source repo directory
}
```

#### `initCmytment(config)`

```typescript
interface Config {
  branch: string; // the branch of the current repo to commit to
  path: string; // an *absolute* path to the current directory
}
```

##### Example

```typescript
// cmytment config & options
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

const options = { quiet: true }

// initCmytment config
const config = {
  branch: 'main',
  rootDir: process.cwd(),
};
```
