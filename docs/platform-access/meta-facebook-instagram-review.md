# Facebook and Instagram review preparation

**Status: drafts prepared; not submitted.** The current checkout has mock connections. A functioning backend and accessible real development-account workflow are required before claiming these permissions are demonstrated.

## Choose the Instagram login product

For a new integration, the proposed path is Instagram API with Instagram Login for business/creator accounts, plus a separate Facebook Page/Messenger connection. Instagram Login does not require linking the professional account to a Facebook Page. This is a proposed choice; check the existing Meta app before changing products. [Official Instagram Login API overview](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/).

If the existing app uses Instagram API with Facebook Login, retain its appropriate `instagram_basic`, `instagram_manage_comments`, and `instagram_manage_messages` permissions and required Page permissions. Do not mix those scopes with the `instagram_business_*` scopes of Instagram Login. [Official Facebook Login API overview](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/).

## Candidate permission requests

These describe the proposed production use. They are not statements that API calls already succeed. Request only permissions that the working application demonstrably uses.

| Permission | Individual justification draft | Evidence to show in the actual app |
| --- | --- | --- |
| `pages_show_list` | Let an authenticated Page administrator see and select the Facebook Pages they are authorized to connect to Comment. | Facebook consent, returned Page list, selected Page appearing in integrations |
| `pages_read_engagement` | Retrieve the connected Page's post context and engagement data needed to display the correct conversation in the inbox. | Page post/context retrieved and displayed for a real development Page |
| `pages_read_user_content` | Read customer-created comments on a connected Page so authorized staff can review incoming interactions. | A customer comment on the Page arriving in the application's inbox |
| `pages_manage_engagement` | Let authorized staff send a human-written reply to a customer comment as the connected Page. | Reply sent through Comment and visible on the Facebook Page |
| `pages_manage_metadata` | Subscribe a connected Page to the webhook events used to keep its inbox synchronized. | Page subscription, real event delivery, and resulting inbox update |
| `pages_messaging` | Let authorized staff receive and answer customer-initiated Messenger conversations for their connected Page. | Customer sends a Messenger message, Comment receives it, staff reply, customer receives the reply |
| `instagram_business_basic` | Identify the authorizing Instagram professional account and its owned media for the connection and inbox context. | Instagram consent, connected account identity, and owned media context |
| `instagram_business_manage_comments` | Let the authorizing professional account review and respond to comments on its owned Instagram media. | Native Instagram comment, real inbox item, app reply, native Instagram reply |
| `instagram_business_manage_messages` | Let authorized staff read and respond to customer messages for the authorizing Instagram professional account. | Native incoming Instagram DM, real inbox message, app reply, native received reply |

Sources: [Meta permission reference](https://developers.facebook.com/docs/permissions/), [Facebook comment publishing reference](https://developers.facebook.com/docs/graph-api/reference/object/comments/), [Messenger getting started](https://developers.facebook.com/docs/messenger-platform/get-started/), [Meta's official Instagram API collection](https://www.postman.com/meta/instagram/documentation/6yqw8pt/instagram-api).

Do not add content publishing, ads management, or insights permissions just because they are available. If hiding comments is included, confirm its endpoint permissions and show that real action separately.

## Application summary draft

> Comment is intended to provide a shared customer-support inbox for businesses that connect Facebook Pages and Instagram professional accounts they are authorized to manage. Its proposed Meta integration will bring authorized customer comments and customer-initiated messages into the inbox, display the associated content, and let staff send deliberate replies as the connected Page or professional account. Each permission is tied to the connection, reading, webhook, or response workflow described in its individual explanation. The current frontend is a prototype; real Meta authorization and provider API workflows must be implemented and tested before this app is submitted for advanced access.

Replace this development-stage statement with a factual description of completed behavior only after the live workflow exists. Confirm the public product domain, Meta app ID, business portfolio, contact email, data processors, retention, deletion, and account ownership before completing the dashboard's data-handling answers.

## Submission sequence

Meta's official submission guide requires a testable app, permission-specific recordings, and successful permission calls. [Official review walkthrough](https://developers.facebook.com/documentation/resp-plat-initiatives/individual-processes/app-review/submission-guide/).

1. Configure the existing app's products, exact server callback URLs, legal links, app icon, and webhook endpoints.
2. Implement and test the requested features using genuine development accounts and permitted app roles.
3. Make a successful call for each requested permission within the preceding 30 days. Meta says its call counters can take up to two days to update.
4. Request advanced access in App Review's permissions/features section. Complete business/access verification and data-handling questions as prompted.
5. Supply reproducible access instructions and a distinct explanation/recording for each requested permission. Show consent and the actual feature. Use English captions where necessary.
6. The account owner reviews the final Platform Onboarding Terms before final submission. Record the result and enable external-customer access only after the required approval and configuration are in place.

## Recording and reviewer access

For comments, record the incoming native comment, consent and account selection, actual retrieval in Comment, staff response, and the reply appearing on the native post. For messages, record a customer-initiated conversation, the incoming message in Comment, staff response, and its arrival in the native inbox. Demonstrate webhook updates for the requested webhook subscription permission.

Provide a testable application login and exact navigation steps to the reviewer. Do not submit a personal Facebook or Instagram account password. Keep all real reviewer credentials outside this repository. Follow current platform messaging rules and verify the applicable response window in the selected product before testing a reply.

## Current gaps to resolve

- No live OAuth callback, server token exchange, or provider API client is present in this checkout.
- The frontend's sample conversations cannot demonstrate actual Meta permissions or successful API calls.
- No webhook receiver, token revocation handler, or backend data-deletion implementation is present here.
- `/privacy`, `/terms`, and `/data-deletion` exist locally, but their public domain, contact method, and stated production practices still need confirmation.

Meta's review team tests the requested behavior; a landing page or simulated inbox alone will not satisfy that review. [Official App Review overview](https://developers.facebook.com/docs/app-review/).
