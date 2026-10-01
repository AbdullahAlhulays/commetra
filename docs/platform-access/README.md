# Platform access applications

Prepared on 2026-09-29 from the official sources linked in each document and the current Comment frontend. These are application drafts and review preparation materials. **No form has been submitted and no platform access has been granted by this work.**

| Platform | Prepared material | What still prevents submission |
| --- | --- | --- |
| TikTok | [Accounts API application](tiktok-accounts-application.md), rejection correction steps, prototype recording script | Registration-name spelling check, business verification evidence, authorized-account estimate, required recording, and form submission |
| Facebook and Instagram | [Meta permission requests and review script](meta-facebook-instagram-review.md) | App/business identifiers, backend OAuth and API functionality, successful permission test calls, reviewer access, and recordings |
| X | [Developer application and OAuth setup](x-developer-application.md) | Existing app details, confirmed data-use answers, server callbacks, and authenticated console access |

## TikTok's rejection

The supplied rejection says TikTok could not find an Accounts API application under the developer-profile email. TikTok requires that form before applying for an app or scope increase involving TikTok Accounts. This is an API for Business application, not a replacement Login Kit application. [Official Accounts API overview](https://business-api.tiktok.com/portal/docs/accounts-api-overview/v1.3).

The public form was inspected directly during preparation of the draft. The TikTok draft records its required information and the correction sequence. User-supplied screenshots on 2026-10-01 show the app name `Comment`, profile company `composio`, Technology Company category, `https://comment.sa/` website, and a configured redirect URL. The user supplied `Abdullah@comment.sa` as the developer-profile email; confirm it in TikTok settings before submission. The screenshots do not prove that the callback is deployed.

## Verified state of this checkout

- [Service entry point](../../src/services/index.ts) exports `mockApiClient` and sets `IS_MOCK_BACKEND = true`.
- [Integration service](../../src/services/mock/integrations.ts) simulates connections and never exchanges provider authorization codes or tokens.
- [Connection dialog](../../src/features/integrations/connect-dialog.tsx) identifies the connection as a demonstration.
- [Inbox moderation demo](../../src/features/inbox/interaction-detail.tsx) simulates TikTok comment replies and hide/unhide actions; no TikTok provider call occurs.
- [Capability matrix](../../src/domain/provider.ts) is explicitly a development placeholder. It does not prove approved platform capabilities.
- [Legal routes](../../src/app/router.tsx) include `/privacy`, `/terms`, and `/data-deletion`. The deployed domain and operation of these pages have not been verified.

TikTok's form permits a prototype recording for a feature still being built. Meta App Review tests the functioning app, so a mock-only demonstration cannot prove its requested permissions. [TikTok form](https://bytedance.sg.larkoffice.com/share/base/form/shrlgu4WEvtSXpEDLcCw56u4Rfc), [Meta App Review](https://developers.facebook.com/docs/app-review/).

## Information to complete

1. Exact legal company name on the Saudi commercial registration and whether it matches profile company `composio`.
2. `Comment` app ID, estimated authorized-account count, and verified Business Center ID or appropriate registration evidence.
3. Public privacy/support contact and production API origin; confirm the configured callback is deployed before claiming live integration.
4. Meta app ID, business portfolio ID, Facebook Page and Instagram professional account used for development, and whether the existing app uses Instagram Login or Facebook Login.
5. X app ID, existing developer access, intended initial features, and a chosen API spending limit if paid access is needed.
6. Required recordings and application login/session access. No authenticated browser or developer dashboard is connected in this session.

Keep credentials, registration documents, recordings containing private data, and actual reviewer passwords outside the repository. The application drafts intentionally contain no account secrets or guessed identity values.

## Work required for live integrations

The existing checkout supplies the UI and service interfaces. Production connections need a backend implementing authorization starts and callbacks, account-bound token storage and refresh, provider API calls, webhook verification or polling, authorization revocation, and data deletion. Runtime capabilities must follow each account's granted scopes. The callback URLs and data-handling promises in the application must match this deployed backend.

The existing deletion page points users to support inside their account, without a concrete public contact address. Before final review, confirm an accessible support/deletion route and actual retention, deletion, processor, and storage practices. Do not claim these have been implemented based on the frontend alone.
