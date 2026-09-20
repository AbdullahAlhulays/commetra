You are a Principal Frontend Engineer, React Architect, Senior Product Designer, UX Engineer, and SaaS Product Engineer.

Your task is to DESIGN AND BUILD a complete, production-quality frontend for a new social-media customer engagement SaaS product.

This is not a generic dashboard exercise.

The final result must feel like a mature, intentionally designed SaaS product built by a strong product/design/engineering team.

You are responsible for both:

1. Product-quality UX/UI design.
2. Production-quality frontend architecture and implementation.

Read every requirement carefully before touching code.

Do not silently replace product decisions with your own preferences.

If an existing repository is provided, inspect it first and preserve relevant project conventions where appropriate.

---

# 1. PRODUCT

Temporary product name:

**Comment**

Comment is a social-media customer engagement platform for businesses.

Its main value proposition is:

**كل تعليقات ورسائل عملائك في جميع منصات التواصل الاجتماعي في مكان واحد**

Businesses connect their social-media accounts and manage customer comments and messages from one unified interface instead of constantly switching between social platforms.

Initial supported platforms:

* Instagram
* Facebook
* TikTok
* X

Google Reviews is explicitly NOT part of this version.

The initial target customers are:

**Small and medium-sized businesses and stores.**

Initial market:

**Saudi Arabia first**, while keeping the product suitable for expansion across the GCC later.

---

# 2. WHAT WE ARE BUILDING NOW

We are building the **complete frontend**.

The frontend must:

* Be fully presentable as a real product.
* Use realistic mock data.
* Have realistic loading, error, empty, disconnected, unsupported, and permission states.
* Be architected so that a real backend and database can be integrated later without rebuilding the application architecture.
* Keep mock infrastructure separate from UI components.
* Use realistic domain models and API boundaries.
* Never pretend mocked provider integrations are real.

We are NOT building the actual production backend or database right now.

However:

**Backend readiness is a core requirement.**

Do not create a frontend architecture that will need to be rewritten when APIs are introduced.

---

# 3. NON-NEGOTIABLE LANGUAGE REQUIREMENTS

The entire product is:

**Arabic-first.**

The UI language is Arabic.

Direction:

**RTL-first.**

Do not build an LTR application and mechanically flip it.

RTL must influence:

* Sidebar placement
* Navigation
* Icons where direction matters
* Alignment
* Tables
* Forms
* Inbox layout
* Drawers
* Toasts
* Dropdown alignment
* Breadcrumbs
* Pagination
* Dialogs
* Mobile layouts

Use Arabic-only labels in the visible product UI unless a platform/product name naturally remains in English, such as Instagram or TikTok.

Arabic copy should be:

* Clear
* Contemporary
* Professional
* Light Modern Standard Arabic
* Not excessively formal
* Not slang-heavy
* Short whenever possible

Primary Arabic font:

**IBM Plex Sans Arabic**

---

# 4. DESIGN PRINCIPLE

This product MUST NOT look like AI-generated SaaS UI.

Avoid the visual clichés commonly produced by AI-generated frontend templates.

ABSOLUTELY AVOID:

* Purple/blue gradients
* Large decorative gradients
* Glow effects
* Glassmorphism
* Floating decorative icons
* Decorative blobs
* Giant empty sections pretending to look premium
* Excessive pill shapes
* Extremely rounded cards
* Huge dashboard cards
* Random decorative illustrations
* Excessive animations
* Unnecessary parallax
* Gratuitous charts
* Overly colorful interfaces
* Generic AI startup aesthetic
* Clutter
* Fake testimonials
* Fake companies
* Fake customer counts
* Fake revenue numbers
* Fake awards
* Fake performance statistics

The design must feel intentional rather than generated.

---

# 5. DESIGN REFERENCES

Use these products as QUALITY REFERENCES, not templates to copy:

### Linear

https://linear.app/

Use Linear as inspiration for:

* Interface discipline
* Information hierarchy
* Typography
* Compactness
* Navigation quality
* Subtle borders
* Product polish
* Fast-feeling interactions

### Attio

https://attio.com/

Use Attio as inspiration for:

* Landing-page composition
* Product storytelling
* Product screenshots as primary visual elements
* Clean spacing
* Sophisticated but restrained presentation

### Intercom

https://www.intercom.com/

Use Intercom as inspiration for:

* Inbox workflows
* Conversation management
* Context panels
* Customer interaction UX
* Operational clarity

### Raycast

https://www.raycast.com/

Use Raycast as inspiration for:

* Precision
* Small interaction details
* Typography
* Excellent UI states
* Keyboard-friendly product feel where appropriate

DO NOT copy their layouts literally.

The product must have its own identity.

---

# 6. VISUAL IDENTITY

Desired feeling:

* Professional
* Modern
* Trustworthy
* Simple
* Mature
* Product-focused

Primary design palette:

### Navy / primary text

`#0F172A`

### Teal / primary interactive color

`#0EA5A4`

### Orange / restrained accent

`#F97316`

### Main light background

`#F8FAFC`

These colors are a starting design system.

Build proper semantic design tokens instead of scattering literal colors throughout components.

Examples:

* background
* surface
* surface-subtle
* border
* border-strong
* text-primary
* text-secondary
* text-muted
* brand
* brand-hover
* accent
* success
* warning
* danger

Orange should be used sparingly.

Teal is the primary action color.

Navy provides hierarchy and readability.

The UI is primarily light mode.

Architect the design tokens so dark mode could be introduced later, but DO NOT spend significant time implementing dark mode now.

---

# 7. SURFACE STYLE

Use:

* Thin clear borders
* Extremely subtle shadows
* Medium border radius
* Approximately 8–12px radius for most surfaces
* Balanced spacing
* Good density
* Clear visual grouping

Avoid making every piece of content a card.

Some information should be organized using:

* Dividers
* Sections
* Rows
* Panels
* Lists
* Tabs

rather than endless cards.

Interface density:

**Medium density.**

The user should see useful information without feeling crowded.

---

# 8. ICONOGRAPHY

Use one consistent line-icon library.

Icons should be:

* Simple
* Crisp
* Recognizable
* Consistent in stroke width

Avoid decorative icon containers unless they communicate meaningful state.

---

# 9. RESPONSIVENESS

Priority:

**Desktop-first, but mobile must still be excellent.**

Desktop should make full use of available space without becoming oversized.

Tablet must not feel like a broken desktop layout.

Mobile must use intentional mobile interaction patterns.

Do not simply shrink desktop components.

For the Inbox on mobile:

**Interaction list → open interaction details as a dedicated screen or sheet → reply from there.**

Do not attempt to preserve the three-column desktop layout on a narrow phone.

---

# 10. ACCESSIBILITY

Target:

**WCAG 2.2 AA where reasonably possible.**

Pay attention to:

* Semantic HTML
* Keyboard navigation
* Focus visibility
* Dialog focus management
* Form labels
* Accessible names
* Contrast
* Button semantics
* Interactive element sizes
* Reduced motion
* Screen reader states
* Error messaging

Do not sacrifice accessibility for visual effects.

---

# 11. FRONTEND TECHNOLOGY

Preferred stack:

* React
* TypeScript
* Vite
* Tailwind CSS
* shadcn/ui as a foundation
* TanStack Query for server-state architecture

Use strict TypeScript.

Avoid `any` unless absolutely justified.

Use a modern routing solution appropriate for Vite React.

If the repository already contains a suitable router, respect it.

Otherwise choose a sensible lightweight solution such as React Router.

Use a clean feature/domain-based structure.

Do not overengineer.

---

# 12. DESIGN SYSTEM

Create reusable design tokens for:

* Colors
* Typography
* Font sizes
* Font weights
* Spacing
* Radius
* Shadows
* Borders
* Motion
* Z-index where useful

Do not hard-code visual values randomly throughout the project.

Create reusable primitives only when there is actual reuse.

Do not create abstraction layers just because they sound architecturally sophisticated.

No Storybook is required for this version.

---

# 13. APPLICATION INFORMATION ARCHITECTURE

The authenticated application has these primary areas:

1. Inbox — primary/default destination
2. Dashboard
3. Integrations
4. Settings

The application should NOT contain Team management in the MVP.

The initial MVP has one primary user per business.

However, the frontend domain architecture must not make future team support impossible.

---

# 14. APPLICATION SHELL

Desktop authenticated layout:

RTL.

Use:

**Right-side Sidebar + lightweight top bar.**

Sidebar should feel refined and relatively compact.

It should contain:

* Inbox
* Dashboard
* Integrations
* Settings

Inbox is the most important item.

The default authenticated route is:

**Inbox**

not Dashboard.

Top bar may include appropriately:

* Current business/workspace
* Search
* Notifications
* User menu

Do not overcrowd it.

---

# 15. LANDING PAGE

Build a complete marketing landing page.

It should be concise, confident, product-led, and focused on the actual software.

Do not turn it into a huge marketing site.

Required structure:

1. Navbar
2. Hero
3. Supported platforms
4. How it works — 3 steps
5. Product / Unified Inbox showcase
6. Main features
7. Use cases
8. FAQ
9. Final CTA
10. Footer

Do NOT include Pricing in this version.

Do NOT include fake testimonials.

Do NOT include fake metrics.

Do NOT include fake company logos.

Do NOT include fake claims such as:

"Trusted by 10,000 companies."

---

# 16. LANDING PAGE NAVBAR

Desktop:

* Logo placeholder on the RIGHT
* Navigation centered where appropriate
* Login + primary CTA toward the LEFT side in RTL composition

Navbar should be sticky.

Logo is NOT finalized.

Create a tasteful text/shape placeholder that can easily be replaced later.

Do not invest time creating a fake permanent logo.

Primary CTA:

**ابدأ مجانًا**

Potential navigation labels can include:

* المميزات
* كيف تعمل؟
* حالات الاستخدام
* الأسئلة الشائعة

Keep navigation concise.

---

# 17. HERO

The Hero is extremely important.

It must impress the user WITHOUT relying on decoration.

The power should come from:

* Excellent typography
* Strong copy
* Clear hierarchy
* Product mockup
* Spacing
* Composition
* Confidence

Hero should contain:

* Strong Arabic headline
* Short supporting paragraph
* Primary CTA: ابدأ مجانًا
* Optional restrained secondary action
* A REALISTIC product UI mockup showing the Unified Inbox

The product UI is the hero visual.

Do not use:

* 3D artwork
* Floating social icons
* Generic illustrations
* Abstract gradients
* Animated blobs

Show the actual usefulness of the product.

---

# 18. SUPPORTED PLATFORMS SECTION

Supported:

* Instagram
* Facebook
* TikTok
* X

Make them visually distinguishable.

The user must be able to immediately understand which platform each interaction originates from.

Platform identity throughout the product can use restrained platform-specific identity cues.

Do NOT let platform colors overwhelm the global design system.

---

# 19. HOW IT WORKS

Use exactly three clear conceptual steps.

For example:

1. اربط حساباتك
2. استقبل التعليقات والرسائل في مكان واحد
3. تابع وردّ بدون التنقل بين التطبيقات

Design this as product explanation, not oversized decorative cards.

---

# 20. PRODUCT SHOWCASE

This should be one of the strongest landing-page sections.

Show a realistic Unified Inbox.

Visitors should immediately understand:

* Multiple social platforms feed one inbox.
* Each interaction is clearly associated with its source platform.
* Businesses can read context.
* Businesses can respond.
* Businesses can organize incoming interactions.

Use realistic Arabic data.

---

# 21. MAIN FEATURES

Keep features focused on real customer value.

Potential areas:

* صندوق وارد موحّد
* التمييز بين المنصات بسهولة
* البحث والتصفية
* متابعة الردود
* ربط عدة حسابات
* الإشعارات
* رؤية سريعة للأداء

Do not invent capabilities beyond the specified MVP.

---

# 22. USE CASES

Target SMB use cases.

Examples could include:

* متجر إلكتروني
* متجر تجزئة
* مطعم أو مقهى
* نشاط محلي
* علامة تجارية صغيرة

The purpose is to explain how they benefit from one social inbox.

Avoid fake business names or fake quotes.

---

# 23. FAQ

Use useful questions instead of filler.

Examples:

* ما المنصات المدعومة؟
* هل أستطيع ربط أكثر من حساب؟
* هل يمكن الرد من داخل المنصة؟
* ماذا يحدث إذا كانت منصة لا تدعم ميزة معينة؟
* هل بيانات الحسابات آمنة؟
* هل المنصة مناسبة للشركات الصغيرة؟

The answer about replies must acknowledge that actual abilities depend on each provider's API/capabilities.

Do not claim provider functionality that has not been verified.

---

# 24. AUTHENTICATION UI

Initial login method:

* Email
* Password

Create:

* Login
* Register
* Forgot-password UI
* Reset-password UI if appropriate

Even though the real auth backend is not implemented, design realistic UI states.

Use separate mock/API abstractions.

Do not hard-code authentication state throughout components.

---

# 25. ONBOARDING

After account registration:

Use a short onboarding flow of approximately 3–4 steps.

Core information requested:

* Company name
* Business category

Then guide the user toward connecting the first social account.

Show clear progress.

Do not ask unnecessary questions.

An example sequence:

1. Welcome
2. Business information
3. Connect social account
4. Ready / Go to Inbox

The exact UX may be refined if there is a clearly better flow.

---

# 26. UNIFIED INBOX — MOST IMPORTANT PRODUCT SCREEN

This is the central product experience.

Spend disproportionately more design attention here than on secondary screens.

Desktop layout:

**3-column layout**

Conceptually:

RIGHT:
Navigation/filter/folder rail or filter panel due to RTL.

CENTER:
Interaction list.

LEFT:
Selected interaction details / context / reply panel.

Adjust exact column proportions based on usability.

Do NOT mechanically force symmetry.

The selected conversation should remain visually clear.

---

# 27. INBOX INTERACTION LIST

Each interaction list item should display enough information to scan efficiently:

* User/customer name
* Avatar when available
* Social platform indicator
* Connected social account
* Short message/comment preview
* Timestamp
* Reply status
* Read/unread state

The design must make Facebook vs Instagram vs TikTok vs X immediately distinguishable.

This is one of the explicit product success criteria.

Do not make platform distinction dependent only on subtle text.

Use a combination of:

* Platform icon
* Small platform label
* Restrained identity cue

while preserving the main Comment visual system.

---

# 28. INTERACTION TYPES

The product concept includes both:

**comments and messages.**

Your domain architecture and UI should therefore not assume every item is only a public comment.

Use a normalized interaction concept.

Possible conceptual types:

* Comment
* Direct message
* Reply

The frontend should allow future provider capabilities without coupling the entire UI to one social platform.

Do NOT invent unsupported specific platform operations.

---

# 29. INBOX FILTERS

Required filters:

* Platform
* Connected account
* Workflow status
* Read / unread
* Replied / not replied
* Date

Filters should be fast and understandable.

Avoid huge filter forms.

Consider:

* Compact filter bar
* Sidebar groups
* Popover controls

based on what works best with the three-column layout.

Active filters must be visible.

Provide an easy way to clear filters.

---

# 30. WORKFLOW STATUS

Supported statuses:

* جديد
* مفتوح
* بانتظار
* تم الحل

Create a small, clear status system.

Do not overwhelm the UI with bright colored badges.

Use semantic color carefully.

---

# 31. INTERACTION DETAIL PANEL

When an item is opened, show:

* Current comment/message
* Author identity
* Platform
* Connected account
* Timestamp
* Workflow status
* Original post context where available
* Post image/video preview where available
* Reply composer if the provider capability allows replying

The original content context is important.

A business should understand WHAT the customer is responding to.

---

# 32. REPLY EXPERIENCE

Use:

**A persistent reply composer at the bottom of the detail panel.**

It should feel similar in quality to mature support/inbox software.

Include:

* Text input
* Clear send action
* Sending state
* Error state
* Retry behavior
* Unsupported state when provider does not allow replies

Do not make replying a modal.

If a provider/account does not support replying, the composer must be disabled or replaced with an explanation.

---

# 33. PROVIDER CAPABILITIES

This requirement is critical.

The frontend must never assume every social platform supports the same capabilities.

Model capabilities explicitly.

Example conceptual type:

```ts
type ProviderCapabilities = {
  canReadComments: boolean;
  canReadMessages: boolean;
  canReplyToComments: boolean;
  canReplyToMessages: boolean;
  canReadPostContext: boolean;
  supportsRealtimeUpdates: boolean;
};
```

This is conceptual; adapt it if the domain requires better naming.

The UI should use capability information.

For unsupported actions:

* Hide them if showing them provides no value, OR
* Disable them and provide a concise explanation when understanding the limitation is useful.

Never create a fake successful action for unsupported features.

---

# 34. SEARCH

Search must conceptually support:

* Interaction text
* Username
* Connected account name
* Original post context

Design the API abstraction as if search will eventually be server-driven.

Do not tightly couple search to filtering an in-memory array.

Mocks may implement it locally, but UI architecture should not assume that forever.

---

# 35. NOTIFICATIONS

Create a simple MVP notification center.

Relevant notification types:

* New interactions
* Social account authorization expired / reconnect required
* Reply failed

Do not build a giant notification system.

A lightweight popover or panel is sufficient.

Include:

* unread/read distinction
* timestamp
* clear action when relevant

---

# 36. INTEGRATIONS PAGE

Display integrations using clean platform cards/rows.

Platforms:

* Instagram
* Facebook
* TikTok
* X

Each provider should clearly show connection state.

Useful states:

* غير متصل
* جاري الربط
* متصل
* يحتاج إعادة ربط
* خطأ
* جاري المزامنة

Connected accounts should be visible under or within each provider.

A business may eventually connect more than one account.

Do not structure data as one hard-coded account per provider.

---

# 37. CONNECT FLOW

Since there is no real backend/provider OAuth yet, create realistic mock connection flows.

Clearly separate development mocks from future real provider integration.

Example behavior:

* Click "ربط الحساب"
* Open a realistic connection dialog/flow
* Show loading
* Show simulated success
* Add connected account to UI

But the code must make it obvious this is mock behavior.

Do not make fake OAuth URLs or fake provider secrets.

---

# 38. DISCONNECT FLOW

Disconnecting an account is destructive enough to require confirmation.

Show a clear confirmation dialog explaining the consequence.

Support:

* Loading
* Success
* Failure

Do not instantly disconnect without confirmation.

---

# 39. DASHBOARD

Dashboard is useful but secondary to Inbox.

Required high-level information:

* Total interactions
* Unreplied interactions
* Distribution by platform
* Interaction trend over time
* Recent interactions

Keep dashboard useful and restrained.

Avoid:

* 8 giant KPI cards
* Meaningless charts
* Rainbow data visualization
* Data just to fill space

Prefer a small number of useful summaries.

---

# 40. ANALYTICS

Analytics in this MVP should remain simple.

Useful KPIs:

* Number of interactions
* Number of replies
* Reply rate
* Average response time
* Interaction volume by platform

If some metric requires backend data not available in the mock environment, make the mock behavior realistic but keep data contracts appropriate for future API responses.

The architecture must allow Analytics to become a separate module later.

Do NOT build a complex BI dashboard.

---

# 41. SETTINGS

Create a focused Settings area.

Possible tabs/sections:

* الحساب
* الشركة
* الإشعارات
* التفضيلات

Do not create dozens of fake settings.

Since there is no Team feature in MVP, do not include team administration.

---

# 42. SINGLE USER MVP VS FUTURE MULTI-TENANCY

MVP:

* No team management
* No assignment
* No roles UI
* No internal notes

However:

The architecture must be **multi-tenant aware from the beginning**.

Create realistic domain concepts such as:

* User
* Organization
* ConnectedAccount
* Interaction
* Reply
* ProviderCapability

Do not create a frontend architecture where all records globally belong to the logged-in user without organization context.

Frontend state/API contracts should understand an organization/workspace boundary.

Actual backend authorization will be implemented later.

---

# 43. DOMAIN MODEL

Create strong TypeScript domain types.

At minimum think through:

```ts
Organization
User
ConnectedAccount
SocialProvider
ProviderCapabilities
Interaction
InteractionAuthor
OriginalContent
Reply
Notification
DashboardMetrics
AnalyticsSummary
```

Do not treat this exact list as mandatory if a cleaner domain emerges.

The important requirement is:

**normalized core models + provider-specific metadata/capabilities.**

Provider-specific differences must NOT leak throughout every component.

---

# 44. NORMALIZED INTERACTION MODEL

Create a normalized interaction model capable of representing content from multiple providers.

Think about fields such as:

* internal ID
* organization ID
* provider
* connected account ID
* provider interaction ID
* interaction type
* author
* text
* timestamp
* read state
* reply state
* workflow status
* original content context
* media
* capabilities
* provider metadata

Do not blindly add everything if unnecessary.

Design it deliberately.

---

# 45. PROVIDER METADATA

There will sometimes be data unique to a provider.

Keep those differences behind a safe boundary rather than adding fields like:

```ts
instagramSomething
facebookSomething
tiktokSomething
xSomething
```

all over shared models.

Use a normalized core model plus provider metadata/adapters where required.

---

# 46. DATA ARCHITECTURE

Use:

**API abstraction + typed services + TanStack Query + separate mock service layer.**

Desired architecture conceptually:

```txt
UI
↓
feature hooks / queries
↓
typed API/service interface
↓
mock implementation today
↓
real backend implementation later
```

Components should NOT directly import giant mock arrays.

Components should NOT know whether the data came from:

* local mock
* REST
* RPC
* backend API

Keep that boundary clean.

---

# 47. MOCK SERVICE LAYER

Create realistic mock services.

Support:

* Successful response
* Loading
* Empty state
* Error state
* Permission/capability differences
* Connection errors
* Reply failure
* Reconnection required

Use small configurable delays where useful so loading UX can actually be seen during development.

Do not create annoying multi-second delays.

---

# 48. MOCK DATA

Mock data should primarily be realistic Arabic data.

Examples should feel plausible for Saudi businesses.

Use different tones and lengths.

Example interaction themes might include:

* Asking about product availability
* Store opening hours
* Delivery questions
* Complaints
* Compliments
* Product sizes
* Prices
* Restaurant reservations
* Order status

Do NOT use offensive or sensitive real-person information.

Do NOT use lorem ipsum.

Mix interactions from all four platforms.

Use realistic timestamps and account names.

Make mock platform distribution visually useful for testing.

---

# 49. STATES

Every important screen must intentionally support:

* Loading
* Success
* Empty
* Error
* Partial error if appropriate
* Disconnected integration
* Expired integration authorization
* Unsupported provider capability

Do not leave these until the end.

---

# 50. LOADING UX

Prefer:

* Skeletons for content surfaces
* Small spinners for compact operations
* Inline pending state for reply
* Button pending state for mutation actions

Do not replace an entire application with a centered spinner whenever something loads.

---

# 51. ERROR UX

Errors should explain:

* What failed
* Whether the user can retry
* What action to take

Examples:

* تعذر تحميل التعليقات
* تعذر إرسال الرد
* يحتاج حساب Instagram إلى إعادة الربط

Do not display raw technical stack traces to users.

---

# 52. EMPTY STATES

Empty states should be useful and contextual.

Examples:

No integrations:

Explain why connecting the first social account matters and provide CTA.

No interactions:

Explain that new messages/comments will appear here.

Filtered result empty:

Explain that nothing matches current filters and allow clearing filters.

Do not use oversized cartoons.

---

# 53. MICRO-INTERACTIONS

Motion should be:

* Light
* Fast
* Functional

Good examples:

* Dropdown transition
* Drawer transition
* Selected Inbox item
* Toast appearance
* Skeleton loading
* Small hover/focus feedback

Bad examples:

* Floating elements
* Long page entrance animations
* Scroll-triggered animation everywhere
* Rotating icons
* Glowing buttons

Respect prefers-reduced-motion.

---

# 54. MOBILE

Mobile navigation should use a sensible adapted pattern.

Do not blindly compress the desktop sidebar.

Inbox mobile flow:

1. Interaction list
2. Select interaction
3. Open detail screen or sheet
4. View context
5. Reply
6. Return to list while maintaining filters/scroll when reasonably possible

Ensure touch targets are appropriate.

---

# 55. PERFORMANCE

Build the application with good baseline frontend performance.

Do not prematurely optimize.

But avoid obvious mistakes:

* Importing huge unnecessary libraries
* Shipping giant mock assets
* Rendering every screen at once
* Excessive context providers
* Monolithic global state
* Unnecessary effects
* Duplicate requests
* Expensive calculations on every render
* Huge DOM lists

Use route-level code splitting where it provides meaningful benefit.

Do not split every tiny component.

---

# 56. REACT ENGINEERING RULES

Avoid unnecessary:

* `useEffect`
* derived state
* global state
* memoization
* callbacks wrapped only for style
* massive Context providers

Ask:

**What external system is this effect synchronizing with?**

If none, an effect may not be necessary.

Server-state belongs primarily in TanStack Query.

Local visual state remains local when possible.

---

# 57. ROUTING

Create proper routes for major screens.

A conceptual route structure might be:

```txt
/
 /login
 /register
 /forgot-password

 /onboarding

 /app/inbox
 /app/dashboard
 /app/integrations
 /app/settings
```

Adapt if a cleaner implementation exists.

Do not create pointless routes for every tiny state.

---

# 58. FRONTEND SECURITY READINESS

Even though the actual backend is not being implemented:

* Never put real secrets in the frontend.
* Never simulate secret provider credentials.
* Never imply frontend role checks are sufficient authorization.
* Avoid unsafe HTML rendering.
* Sanitize/avoid arbitrary provider HTML.
* Treat external URLs carefully.
* Assume backend must enforce tenant authorization later.

Document those boundaries in appropriate developer comments/docs rather than cluttering UI.

---

# 59. FUTURE AI READINESS

NO AI features are part of the current MVP.

Do NOT add:

* AI buttons
* AI badges
* magic sparkles
* generated reply UI
* fake sentiment AI
* fake assistants

However, keep architecture flexible enough that future capabilities could include:

* Suggested replies
* Sentiment
* Complaint detection
* Sales-intent detection
* Summaries

Do not overengineer the current code for them.

No visible "Coming Soon AI" clutter.

---

# 60. DESIGN SUCCESS CRITERIA

The product succeeds visually and functionally if:

### 1. It is immediately understandable.

A new user should quickly understand what Comment does.

### 2. The Landing Page is impressive.

The impression should come from product quality rather than decoration.

### 3. The workflow feels natural.

Connecting accounts → receiving interactions → filtering → opening → replying should make sense.

### 4. Platform origin is obvious.

Users should quickly distinguish Facebook, Instagram, TikTok, and X interactions.

### 5. Inbox quality is exceptional.

This is the core product and should receive the most attention.

### 6. Arabic RTL feels native.

Not translated. Not flipped. Designed RTL-first.

### 7. It feels like real software.

No template-like placeholder design.

---

# 61. COPYWRITING

Do not use generic AI-generated marketing language such as:

"ارتقِ بتجربتك إلى المستوى التالي"

or:

"حل ثوري يعيد تعريف التواصل"

Avoid meaningless superlatives.

Write concrete product copy.

For example, communicate:

* What is centralized
* What time it saves
* Why switching between apps is inefficient
* How conversations become easier to manage

Keep claims truthful.

---

# 62. PRODUCT DIFFERENTIATION IN THE UI

One of the product's key visual challenges is combining multiple social networks without making the interface chaotic.

Solve this carefully.

The user should always understand:

* Who wrote the interaction
* Which platform it came from
* Which business social account received it
* What content/post it relates to
* Whether the business replied
* What state the interaction is currently in

Hierarchy is more important than decoration.

---

# 63. DO NOT BUILD FAKE FEATURES

If a feature is not in the requirements, do not add it just to make the UI seem richer.

In particular DO NOT invent:

* CRM
* Email inbox
* WhatsApp
* Google reviews
* Team assignment
* SLA rules
* Automations
* Chatbot
* AI copilot
* Knowledge base
* Campaign management
* Content scheduler
* Social posting
* Ads manager

We can add them later if product requirements change.

---

# 64. COMPONENT QUALITY

Do not produce one 2,000-line component.

But also do not split every 15 lines into a component.

Use sensible boundaries.

Strong reusable candidates include:

* Application shell
* Sidebar
* Header
* Platform indicator
* Interaction list item
* Interaction list
* Interaction detail
* Reply composer
* Filter controls
* Status indicator
* Integration card
* Empty state
* Error state
* Skeleton states
* Dialogs
* Toast patterns

Feature-specific logic should stay with its feature.

---

# 65. PROJECT STRUCTURE

Choose a clean structure.

A reasonable direction might resemble:

```txt
src/
  app/
  components/
  features/
    auth/
    onboarding/
    inbox/
    integrations/
    dashboard/
    settings/
    notifications/
  domain/
  services/
  mocks/
  hooks/
  lib/
  styles/
```

This is guidance, not a mandatory exact folder tree.

Prefer structure based on responsibilities rather than arbitrary architectural ceremony.

---

# 66. TESTING

Set up useful tests, focusing on important behavior.

At minimum test important flows/components such as:

* Inbox filtering
* Provider distinction
* Selecting an interaction
* Reply capability enabled/disabled
* Reply mutation behavior
* Integration connect/disconnect UI
* Onboarding progression

Do not write enormous low-value snapshot suites.

Use appropriate frontend testing tooling.

---

# 67. QUALITY CHECKS

The project should finish with working:

* Typecheck
* Lint
* Tests
* Production build

No ignored TypeScript errors.

No giant console-error list.

No knowingly broken routes.

No obviously dead components.

---

# 68. IMPLEMENTATION PROCESS

You are authorized to build the entire frontend in this task.

Do NOT stop after every stage asking for approval.

However, work internally in disciplined stages.

Suggested stages:

### Stage 1 — Repository + foundation

* Inspect repository
* Establish stack
* Configure typography
* Configure RTL
* Create design tokens
* Set routing foundation
* Set base UI primitives

### Stage 2 — Domain + data architecture

* Domain types
* Typed service interfaces
* TanStack Query configuration
* Mock service layer
* Realistic Arabic mock data

### Stage 3 — Marketing website

* Navbar
* Hero
* Product showcase
* Supported platforms
* 3-step explanation
* Features
* Use cases
* FAQ
* CTA
* Footer

### Stage 4 — Authentication + onboarding

* Login
* Registration
* Password recovery UI
* Onboarding
* Company setup
* First integration setup

### Stage 5 — Authenticated shell

* RTL Sidebar
* Top bar
* Notifications
* Navigation
* Responsive shell

### Stage 6 — Unified Inbox

This stage deserves the most attention.

Build:

* 3-column layout
* Interaction list
* Platform identity
* Filters
* Search
* States
* Interaction details
* Original content context
* Reply composer
* Capability handling
* Responsive mobile interaction

### Stage 7 — Integrations

* Provider cards
* Connected accounts
* Mock connect
* Disconnect confirmation
* Reconnect/error/sync states

### Stage 8 — Dashboard + Analytics

* Required KPIs
* Useful visualizations
* Recent interactions

### Stage 9 — Settings

* Account
* Business
* Notifications
* Preferences

### Stage 10 — Production-quality pass

* Accessibility
* Responsive behavior
* Error states
* Loading states
* RTL audit
* Empty states
* Keyboard behavior
* Visual consistency
* Remove dead code
* Performance sanity check

After each major stage, run appropriate validation instead of waiting until the end.

---

# 69. BEFORE YOU IMPLEMENT

Before changing files, inspect:

* package.json
* lockfile
* existing src tree
* Vite configuration
* TypeScript configuration
* Tailwind configuration if present
* router if present
* existing design system
* existing components
* existing tests
* existing assets

Do NOT destroy good existing work.

If the repository is blank or starter-only, establish the architecture described above.

---

# 70. VISUAL DECISION AUTHORITY

The product owner has already decided:

* Arabic RTL-first
* Navy + teal + restrained orange
* Light interface
* IBM Plex Sans Arabic
* Medium UI density
* Medium 8–12px radii
* Thin borders
* Very subtle shadows
* Product-first marketing
* No AI-template aesthetic
* Landing Page includes actual product mockup
* Inbox is highest priority
* One-user MVP
* No pricing
* No fake testimonials
* No Google Reviews
* No visible AI features
* Facebook + Instagram + TikTok + X only

Do NOT reopen these decisions unless technically impossible.

You have design discretion over details not specified here.

When making those decisions, optimize for:

1. Clarity
2. Usability
3. Visual hierarchy
4. Product maturity
5. Consistency
6. Accessibility
7. Performance

---

# 71. IMPORTANT DESIGN REVIEW BEFORE FINISHING

Before declaring the project complete, review every major screen and explicitly ask yourself:

### Does this look AI-generated?

Look for symptoms such as:

* Too many cards
* Repeated identical section layouts
* Excessive centered content
* Giant empty whitespace
* Pointless icons
* Decorative gradients
* Huge radii
* Generic copy
* Every section having icon + headline + paragraph
* Dashboard made entirely from KPI cards
* Marketing section repetition

If yes, redesign it.

### Does this look like a real product team built it?

Check:

* Information density
* Hierarchy
* Alignment
* Typography
* State consistency
* Workflow continuity
* Navigation
* Mobile adaptation
* RTL correctness
* Interaction detail

---

# 72. INBOX REVIEW

Before finishing, specifically test the Inbox using interactions from:

* Facebook
* Instagram
* TikTok
* X

Verify that a user can distinguish them rapidly without studying each card.

Verify the full workflow:

1. Open Inbox.
2. Scan interactions.
3. Filter by provider.
4. Search.
5. Open an interaction.
6. Understand the original content.
7. Understand whether it was replied to.
8. Write a reply.
9. Submit.
10. Observe loading/success.
11. Test simulated failure.
12. Test provider that cannot reply.
13. Resolve interaction.
14. Use mobile layout.

This workflow is more important than decorative polish elsewhere.

---

# 73. FINAL VERIFICATION

Before concluding:

Run:

* TypeScript typecheck
* Lint
* Tests
* Production build

Fix actual failures.

Then inspect representative screens at:

* Desktop
* Tablet
* Mobile

Check RTL carefully.

Check for:

* Horizontal overflow
* Clipped Arabic text
* Incorrect icon directions
* Broken drawers/dialogs
* Overflowing Inbox columns
* Mobile reply problems
* Navigation problems
* Empty states
* Loading states

---

# 74. FINAL RESPONSE FORMAT

When implementation is complete, do not give me a giant essay.

Give me a concise engineering summary containing:

### Built

List the major implemented areas.

### Architecture

Explain the important frontend/data boundaries.

### Mock vs Real

Clearly state which provider/backend behavior is mocked and where the replacement boundary is.

### Validation

Report:

* Typecheck
* Tests
* Build

### Important Files

List the main architectural entry points.

### Remaining Backend Work

Briefly list what needs to be connected later:

* Authentication backend
* Database
* Organization authorization
* Provider OAuth
* Provider APIs
* Webhooks/synchronization
* Real reply endpoints

Do not claim these are implemented if they are not.

---

# FINAL DIRECTIVE

Build a frontend that could credibly be shown to:

* prospective customers,
* investors,
* engineers,
* and a future backend team

without looking like a prototype or AI-generated template.

The core design philosophy is:

**Product quality over decoration.**

**Clarity over visual noise.**

**Real workflows over fake features.**

**Arabic RTL as a first-class design system.**

**The Unified Inbox is the product.**

Proceed with repository inspection and implementation.
