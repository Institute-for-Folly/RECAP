# base/demos research log

## Access attempts

* `curl -L https://api.github.com/repos/base/demos/contents` returned `curl: (56) CONNECT tunnel failed, response 403`.
* `curl -I https://github.com` returned `HTTP/1.1 403 Forbidden` (CONNECT tunnel failed).

Because outbound access to GitHub is blocked, I could not enumerate the demo folders or inspect their contents.
