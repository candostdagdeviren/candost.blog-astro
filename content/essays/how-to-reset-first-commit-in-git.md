---
title: "How to reset the first commit in Git"
description: "We cannot use interactive rebasing and resetting. Both of them have security mechanisms to prevent this action. Instead, we have to use other approaches."
tags:
  -
date: 2020-12-22
updateDate: 2021-12-22
external: false
---

When we want to change the initial commit on the main (or master) branch, we cannot use interactive rebasing and resetting. Both of them have security mechanisms to prevent this action. Instead, we either have to change our main (using `—-orphan`) or delete the branch while on it.

> Don't use `rm -rf .git`. This command deletes everything related to Git in the repository. We will lose all the branches and the commits.

Let's change the `main` branch.

First, we need to rename the `main` branch (Before running this command, we assume a branch named `old_main` doesn't exist.).

```shell
git branch -m main old_main
```

The `-m` or the `--move` flag is used to rename/move the branch and its reflog. This moves everything (all the commits and history) from the `main` branch to the `old_main` branch. Now our branch looks like this: `old_main:main`.

Next, we need to create an orphan branch from the current head.

```shell
git checkout --orphan main
```

`--orphan` creates a new branch without a root so that the newly created branch doesn't have a history and a parent. The new branch is totally disconnected from all other branches and commits. But it still has all the files from the `old_main`, because we created a new branch while we were in the `old_main` branch.

The last thing is deleting the `old_main` since we don't need it anymore (we can keep it to preserve history if we want to).

```shell
git branch -D old_main
```

Now we have the latest changes, and we are in a brand new `main` branch. But there is another way to do this with a single command. Before running the following command, we need to make sure we're on the `main` branch.

```shell
git update-ref -d HEAD
```

This command deletes the branch we are in. If we are in `main`, this command will delete the `main` branch, and all the commits.
