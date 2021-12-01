# Commitment (commitmnt)

Do you work for a company that uses Gitlab or Bitbucket? Are you worried that people are looking at your cold 🥶, barren 🌵 husk of a Github activity graph and judging you? Wondering if you even still code anymore? Commitment is a node.js library that helps you copy your commit history from a list of source repositories into a new repository you can then push up to Github.

There are several projects floating around Github that will _fake_ you a commit history in a fresh repo, but that seemed bogus and so this library was born. **No data is leaked from the source repos other than the dates of your commits.** Once you copy the commits from your source repos to your new repo, you can then push the new repo up to Github and make it private (or don't!) and bingo. You now have a big green beautiful.. and most importantly **accurate** Github activity graph 📈.

This project is intended to be silly and fun. Please don't take it too seriously 👋.

#### Old 😢

<img alt="Empty Activity Graph" src="https://i.ibb.co/bLRmNx2/gh-activity-empty.png" width="850" height="170" />

#### New 😄

<img alt="Full Activity Graph" src="https://i.ibb.co/JxWxhj2/gh-activity-full.png" width="850" height="170" />

## Installation & Setup

```
# create a new project
mkdir work-history
cd work-history

# initialize a fresh git repo
git init

# install the library
yarn init
yarn add commitmnt

touch index.js && code ./
```

## Usage

The library exposes two functions to help you copy commits from your source repos to your destination repo.

### Basic

`commitment(config, options)` is the basic export of the library and is intended to be a quick and easy solution to copy commits from a list of source repos.

```typescript
// in index.js
import { commitment } from 'commitmnt';

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

  await commitment(config); // done 😃
}

main();
```

### Advanced

`initCommitment(config)` is a function that takes some configuration and returns you some utilities you can use to read and copy commits from your source repos. These utilities are exposed to help you in case you want to do something a little different (eg. only copy commits that occur on weekdays).

The following is an example of combining the provided utilities to only copy commits from a source repo that occurred on weekdays.

```typescript
// in index.js
import { initCommitment } from 'commitmnt';
import { isWeekend } from 'date-fns';

async function main() {
  const config = {
    branch: 'main',
    rootDir: process.cwd(),
  };

  const { getCommitsForRepo, copyCommitsToRepo } = await initCommitment(config);

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

#### `commitment(config, options)`

```typescript
interface Config {
  // the branch of the current repo to commit to
  branch: string;
  // an *absolute* path to the current directory
  path: string;
  // a list of source repos to copy from
  repositories: Repository[];
}

interface Options {
  // option to silence progress output from the library
  quiet: boolean;
}

interface Repository {
  // some identifier to help the library match your
  // commits by commit author such as "Chris Carrick" or "chris@crcarrick.dev"
  // this can also be a pattern -> "\(Chris\|Christopher\) Carrick"
  author: string;
  // the branch of the source repo to copy commits from
  branch: string;
  // an *absolute* path to the source repo directory
  path: string;
}
```

#### `initCommitment(config)`

```typescript
interface Config {
  // the branch of the current repo to commit to
  branch: string;
  // an *absolute* path to the current directory
  path: string;
}
```

##### Example

```typescript
// commitment config & options
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

// initCommitment config
const config = {
  branch: 'main',
  rootDir: process.cwd(),
};
```
