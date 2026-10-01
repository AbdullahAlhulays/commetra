# TikTok Accounts API application draft

**Status: not submitted.** Business verification evidence, estimated account volume, an actual recording, and a final spelling check against the commercial registration remain outstanding. This draft addresses the rejection supplied on 2026-09-29. Screenshots supplied on 2026-10-01 confirm the profile and app details below, but do not establish that the callback works.

## Required identity and evidence

| Information requested by the form | Value or next action |
| --- | --- |
| Registered legal business name | `Composio` (user stated this is the Saudi commercial-registration name; check exact spelling and capitalization on the document) |
| Company name in developer profile | `composio` (user-supplied profile screenshot) |
| Applicant name in developer profile | `Abdullah Alhalees` (user-supplied profile screenshot) |
| Existing developer app name | `Comment` (shown in the supplied app screenshot) |
| Configured advertiser and account-holder redirect URL | `https://comment.sa/api/integrations/tiktok/callback` (shown in the supplied screenshots; backend endpoint and deployment unverified) |
| Developer registration email | `Abdullah@comment.sa` (supplied by user; verify that this is the registered TikTok profile email) |
| Company website in developer profile | `https://comment.sa/` (user-supplied profile screenshot) |
| Primary country of operation | Saudi Arabia (user-supplied profile screenshot) |
| Business verification method | Saudi commercial registration, if accepted for the chosen form path; otherwise verified company-owned Business Center |
| Verification attachment or Business Center ID | `[REQUIRED: upload the registration document to TikTok OR enter a verified Business Center ID]` |
| Permission use case | Read comments and replies on owned videos, reply to comments, and hide/unhide comments; confirmed by user |
| Recording | `[REQUIRED: attach an actual recording; prototype script below]` |
| Expected authorized-account volume | `[REQUIRED: genuine estimate using the form's offered bands]` |
| Developer account category | Technology Company (user-supplied profile screenshot) |
| Usage and revocation acknowledgment | Review the actual statement personally before agreeing |

Do not guess account volume or choose another developer category to change review eligibility. For a direct advertiser estimating more than 200 accounts, the form asks for an additional explanation.

Sources: [application form](https://bytedance.sg.larkoffice.com/share/base/form/shrlgu4WEvtSXpEDLcCw56u4Rfc), [business verification documentation](https://ads.tiktok.com/help/article/acceptable-documents-for-business-verification).

## Application use-case text

The user chose comment reading, replies, and hiding for the initial TikTok Accounts API request. The supplied app description also mentions future business messages. Remove that sentence for this Accounts API submission: business messages require the separate Business Messaging API process. Align selected endpoint permissions, form use case, app description, and recording.

### Suggested developer app description

This text is 456 characters, below the 500-character limit shown in the app screenshot:

> Comment is a customer engagement platform for businesses. With authorization from each TikTok account holder, Comment uses the TikTok Accounts API to read comments and replies on the account's own videos, show video context, let authorized staff reply to comments, and hide or unhide unwanted comments. Staff manage these interactions alongside other channels in one inbox. This request does not include direct messages, video publishing, or ad management.

The current web app demonstrates these actions with simulated data and makes that status visible. A working callback and provider calls are still required for a live integration.

> Comment is a web application in development that is intended to help businesses and their authorized staff manage customer interactions across social platforms from one inbox.
>
> For the initial TikTok integration, we request Accounts API access for comments on videos belonging to TikTok accounts whose owners expressly authorize Comment. Comment retrieves comments and their replies, plus the account and video context needed to understand them. Authorized staff can reply to a comment and hide or unhide an unwanted comment on an owned video. Staff also organize interactions in the shared inbox and track which ones require attention. The request does not include direct messaging, video publishing, advertising management, or access to unrelated users' private data.
>
> The API is necessary to combine these authorized TikTok interactions with the business's other support channels in a single queue. Switching among separate native interfaces does not provide this shared cross-platform workflow.
>
> The current frontend prototype uses simulated data, connections, replies, and hide/unhide actions. The accompanying recording is identified as a prototype of the intended flow; it is not a demonstration of already authorized live TikTok API calls. Production OAuth, provider API access, and token handling remain to be implemented after access and the necessary development configuration are available.

The requested endpoints must be matched to the exact granted permissions in the developer dashboard. TikTok's current Accounts API documentation includes reading comments and replies, replying to comments, and hiding/unhiding comments, but documentation alone does not grant access. TikTok business DMs use the separate Business Messaging API process. [Official API for Business documentation](https://business-api.tiktok.com/gateway/docs/index?language=ENGLISH).

## Prototype recording script

This is a proposed recording plan, not a completed recording. The current form accepts a prototype where the feature is not integrated yet. A timed narration and caption script is ready in [tiktok-review-recording-script.md](tiktok-review-recording-script.md).

1. Introduce the app by the same name used in the developer application. Display a clear prototype label throughout.
2. Open the existing `/demo` route and explain that account and interaction data are simulated.
3. Visit `/app/integrations`, select TikTok, and show the explanation of the simulated connection. Describe the planned redirect to TikTok's authorization page rather than presenting the dialog as real TikTok authorization. The configured `https://comment.sa/api/integrations/tiktok/callback` URL is not implemented in this frontend checkout.
4. Complete the prototype connection, then use **عرض تعليقات TikTok التجريبية** to open the TikTok comment filter in `/app/inbox`.
5. Open the sample TikTok comment from وليد العمري and show the related video, customer follow-up reply, and visible prototype notice.
6. Type and send a sample reply, then show the **إخفاء التعليق تجريبيًا** and **إظهار التعليق تجريبيًا** actions. State aloud and in captions that all three actions are local simulations and did not reach TikTok.
7. Return to integrations and show disconnecting the prototype account. Describe how production revocation and deletion will be implemented without claiming that a real token was revoked.

Use only demonstration data in the recording. Include English captions if the UI is Arabic.

## Correct the rejection and reapply

1. Check the registered email in [TikTok for Business settings](https://ads.tiktok.com/ac/page/settings/), the company/category in the [developer profile](https://business-api.tiktok.com/portal/developer/profile), and confirm that the rejected app is `Comment` in the [apps dashboard](https://business-api.tiktok.com/portal/apps).
2. Complete the linked form using those matching details and the required evidence. Avoid duplicate submissions; correct a prior mismatch deliberately.
3. Preserve the submission confirmation, date, and profile/app identifiers privately.
4. Reapply for the rejected app after the form is submitted, following any additional instructions displayed by TikTok. Completing the form is a prerequisite and does not guarantee API approval. [Accounts API overview](https://business-api.tiktok.com/portal/docs/accounts-api-overview/v1.3).

If the application provides a place to explain the correction, use this text only after the statement is true:

> We have now submitted the Accounts API access application for [APP NAME] using [EXACT PROFILE EMAIL], matching our developer profile. The submission was completed on [DATE]. Please review the app again with the corresponding Accounts API application. Our initial use case and scope are described consistently in both submissions.
