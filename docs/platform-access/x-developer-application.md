# X developer application and connection setup

**Status: draft prepared; not submitted.** No X application credentials, API purchase, or live connection has been created by this work.

## Application description draft

> Comment is a customer-support web application in development. The planned X integration will let businesses authorize their own accounts, view account-related mentions and replies in a shared inbox, and send human-written responses. Where separately authorized and implemented, it will also allow staff to read and respond to that connected account's direct messages. These workflows will use user-context authorization. The current frontend uses simulated accounts and messages; production X API authorization and calls have not been implemented in this checkout.

This is a proposed use-case description, not an assertion of existing live functionality. Confirm all planned uses of X data, the company identity, data handling, and whether any separate backend uses AI before completing the developer console's declarations. Do not promise a retention/deletion practice that has not been implemented.

## Proposed OAuth scopes

| Scope | Reason | Include when |
| --- | --- | --- |
| `tweet.read` | Read account-related posts, mentions, replies and conversation context | Post inbox is implemented; also required with the documented DM scopes |
| `users.read` | Identify the authorizing user and display the connected account | Connection is implemented; also required with DM scopes |
| `tweet.write` | Send a deliberate public reply as the authorized account | Posting replies is implemented and shown |
| `dm.read` | Retrieve private messages belonging to the authorized user | DM inbox is implemented and separately authorized |
| `dm.write` | Reply to customer DMs as the authorized user | DM reply workflow is implemented; also request `dm.read` |
| `offline.access` | Obtain refresh access for the background integration | Backend implements refresh storage, rotation and revocation |

Private DMs require user-context authentication; the app-only bearer token cannot read them. [Official DM lookup guide](https://docs.x.com/x-api/direct-messages/lookup/integrate), [official DM management guide](https://docs.x.com/x-api/direct-messages/manage/integrate).

Use OAuth 2.0 Authorization Code with PKCE. The implementation should verify `state`, use PKCE S256, and exchange/refresh tokens on the backend. Register the exact deployed callback, not an invented frontend route. [Official OAuth 2.0 guide](https://docs.x.com/fundamentals/authentication/oauth-2-0/user-access-token).

## Developer console steps

1. Sign in to [the X developer console](https://console.x.com/) using the actual account owner. Review the developer agreement personally if it has not already been accepted.
2. Use the existing application when one exists, or create an app with the confirmed company/product name, website, description, and use case. [Official getting-access guide](https://docs.x.com/x-api/getting-started/getting-access).
3. Configure user authentication for the deployed backend and record the exact callback, website, privacy, and terms URLs. Confirm the relevant endpoint access in the console.
4. Keep the generated credentials in the backend's secret store; do not add them to this frontend, Git, or chat.
5. Choose a spending limit before purchasing API credits. Current official documentation describes pay-per-use credits and endpoint-specific charges. No spending amount is authorized in this task. [Official pricing](https://docs.x.com/x-api/getting-started/pricing).
6. Implement consent, retrieval, human-authored replies, disconnect/revocation, and deletion. Validate the working account-specific workflows before describing them as available to customers.

## Recording and validation plan

Show X consent with only the requested scopes, the correct connected-account identity, an incoming mention/reply in the real inbox, and an app-written response appearing on X. If DMs are included, show an inbound customer DM and the staff reply reaching that customer's native inbox. Record consent revocation and the application's response to lost access.

X public replies are posts in conversations, rather than a Meta-style comments API. Confirm endpoint availability and billing for each workflow. Polling and webhooks are separate implementation/access choices; the frontend's mock capability flags do not establish either.

The backend callback domain, exact app ID, production data policy, and intended initial scope remain outstanding. This draft is ready to customize when those details are supplied.
