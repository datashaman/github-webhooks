# github-webhooks

> A node module that enables your apps to listen for GitHub webhooks.

# getting-started

You'll want to be familiar with how GitHub webhooks work; you can view an in-depth explanation by visiting the [GitHub webhook documentation](https://developer.github.com/webhooks/).
 
# installation

```
$ npm install github-webooks
```

# example

```
const webhooks = require('github-webhooks');

webhooks.on('push', function(data) {
  // do something with the push data
});

webhooks.on('pull-request', function(data) {
  // do something with the pull request data
});

// it's over 9000!!!
webhooks.listen(9001);
```

# supported webhooks

`github-webhooks` supports **all** GitHub webhooks.

# supported events

To listen to an event, simply call `.on('event-name', myCustomFunction)` where:

1. `event-name` is a valid event name from the list below
1. `myCustomFunction` is the function that you want to execute when the event is fired.


Here are the events that `github-webhooks` currently supports:

* `commit-comment` - emitted when a commit or diff is commented on
* `create` - emitted when a branch or tag is created
* `delete` - emitted when a branch or tag is deleted
* `deployment` - emitted when a repository is deployed
* `deployment-status` - emitted when the deployment status is changed via the API
* `fork` - emitted when the repository is forked
* `gollum` - emitted when the wiki page is updated via Gollum
* `issue-comment` - emitted when an issue is commented on`
* `issues` - emitted when an issue is opened, closed, assigned or labeled
* `member` - emitted when a collaborator is added to a non-organization repository
* `page-build` - emitted when a GitHub pages site is built
* `public` - emitted when the repository changes from private to public
* `pull-request` - emitted when a pull request is opened, closed, assigned, labeled or synchronized
* `pull-request-review-comment` - emitted when a pull request diff is commented on
* `push` - emitted when a git push occurs for the repository
* `release` - emitted when a release is published in a repository
* `status` - emitted when a commit status is updated via the API
* `team-add` - emitted when a GitHub team is added or modified
* `watch` - emitted when a user watches a repository

# license

The MIT License (MIT)

Copyright (c) 2015 Carl Danley and contributors

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
