# **Baseline Studio — Master Guide & Lessons Learned**

*(Consolidated from the Master Guide, Falcons build log, general lessons log, and Silverbacks build log)*

---

## **🔴 RULES VIOLATED MOST OFTEN — CHECK THESE FIRST, EVERY BUILD**

These four rules have been broken and re-fixed across nearly every build (Lobsters, Falcons, Silverbacks, Merrimack Magic). They get their own section at the top because "mentioned once in a long list" clearly hasn't been enough.

### **1\. NO EM DASHES. ANYWHERE. EVER.**

Flagged as a hard rule from the start of the Silverbacks build and *still* had to be caught repeatedly — in static HTML, in JS-generated content (news bodies, dashboard messages, form confirmations), and especially in copy adapted from client source material (Facebook posts and flyers routinely contain em dashes that bleed straight into the site if not caught during rewrite). Also flagged independently on the Lobsters build. Held up cleanly on the Merrimack Magic build via a standing automated grep check before every delivery — proof this actually works when done consistently, not just a nice idea.

* Use a comma, period, colon, or reword the sentence instead.  
* **Mandatory final step before every delivery, every build, no exceptions:** grep the entire file for `&mdash;` and the literal `—` character.

### **2\. HERO SECTION: ONE HEADING, ONE CTA. NOTHING ELSE.**

Violated on the Falcons build, the Silverbacks build, **and again on Merrimack Magic** (an eyebrow "crumb" label above the heading, despite this being an explicit standing rule stated on day one of that build). Three separate builds, same mistake — this is clearly not sinking in from being stated once at project start; it needs to be actively checked, not just remembered. The hero keeps growing extra elements that then have to be stripped back out: eyebrow tags ("Vermont Falcons Baseball · Est. 2016", "Perfect Game League" banner), floating stat boxes, secondary taglines, descriptive strips below the hero, duplicate CTAs (same button in nav and hero).

* Hero \= headline \+ at most one single-line CTA. Nothing stacked above or below unless the client explicitly asked for it.  
* Treat any eyebrow label, badge, or secondary tagline as scope creep by default — do not add proactively.  
* **Add this to whatever automated pre-delivery check already exists for em dashes** (grep for common eyebrow-pattern markers, or just visually scan every hero on every page before delivery) — a rule that's been broken three times needs an active check, not just a memory of the rule.

### **3\. NEVER INLINE DATA INTO `onclick="..."` STRINGS.**

Broke silently on the Lobsters build and was flagged again independently on the Falcons build. Nested quotes (apostrophes in names, JS template literals wrapping HTML attributes) cause silent `innerHTML` failures in some browsers.

* Always use index-based lookups into a global array instead.  
* This includes `onmouseover` and any other inline event handler generated inside a JS template string.

### **4\. VERIFY SUPABASE COLUMN NAMES *BEFORE* WRITING ANY INSERT/SELECT CODE.**

This caused wasted cycles on nearly every backend build — guessed column names never matched reality: `positions` not `primary_position`, `graduation_year` not `grad_year`, `college` not `school`, `venue_name` not `venue`, `class_year` not `year`, `name` not `first_name`/`last_name`. Also bit the Falcons build (`high_school` assumed present on live Supabase rows when it wasn't in the schema) and caused silent 400s on `tryout_registrations`/`interest_submissions` in another session.

* Before writing a single line of DB-touching JS, run: `SELECT column_name FROM information_schema.columns WHERE table_name = 'your_table';` for every table involved, and document them together in one place.  
* Schema drift between sessions is real — re-verify even for tables built in an earlier session, don't assume.

---

## **1\. Business Overview**

**Baseline Studio** — web design & digital operations studio for US travel youth sports organizations, primarily travel baseball (expanding into softball).

* **Founders:** Isaiah Hedquist (technical builds, client relationships) \+ Natalie Vavricka (design), based in Aschaffenburg, Bavaria, Germany.  
* **Registration:** Freiberuflerin under Natalie, Aschaffenburg. All clients are US-based, so no German VAT applies.  
* **Contact:** business/client-facing — info@baselinestudio.org. Isaiah's personal (also usable for direct outreach, e.g. warm leads/referrals) — isaiahhedquist@gmail.com.

## **2\. Platform & Architecture**

**❌ Wix is no longer used for anything.** All current and future builds use the single-file/Netlify architecture.

* Every site is a **single `index.html`** file, inline CSS/JS, no build tools, written directly through Claude.  
* Deployed to **Netlify** by dragging a folder (not a bare file) into the deploy area — the file must be named `index.html` exactly.  
* **Backend:** Supabase (PostgreSQL, Auth, Edge Functions).  
* **Payments:** Stripe (parent-facing) \+ Stripe Connect (production tuition splitting) \+ Wise (masks Natalie's German IBAN from US clients, handles USD→EUR conversion).  
* **Email:** Resend (transactional/invite emails — see Auth section, this replaced Supabase's built-in email early on), EmailJS (contact forms — `service_iuz6i3b` for baselinestudio.org, `service_afd2kww` for Lobsters).  
* **Domain registrar:** Namecheap (`baselinestudio.org`).

**Why single-file:** a two-file split (`index.html` \+ a separate data `.js` file) completely broke an early Lobsters iteration — no buttons worked, no pages loaded. Decide single-file vs. multi-file *before* writing any code and never switch mid-build. Only reconsider if JS exceeds \~150KB or the client needs a real build system for a specific reason. One file is great for simplicity and portability but gets harder to debug as it grows — keep a clear section structure with comments (DATA, AUTH, TEAMS, SCHEDULE, etc.) and note line numbers of major sections as the file grows.

## **3\. Revenue Model**

**Standard clients:**

* One-time build fee: \~$300–500  
* Monthly retainer: $75–200, **or** $30–50 per-change pricing as an alternative  
* 1% transaction fee on tuition/registration payments processed via Stripe Connect  
* Elite tier waives the build fee entirely — the 1% tuition fee covers it instead

**Exception — Granite State Silverbacks:** no build fee at all; 1% transaction fee still applies; small fee for content updates; first 3 months of updates free. (Nonprofit, run by one coach for his own two kids, families don't pay to play — see client profile below.)

## **4\. Live Demo Sites (Portfolio)**

All subdomains of `baselinestudio.org`, Netlify-hosted, sharing one Supabase project.

| Demo | Subdomain | Tier | Status |
| ----- | ----- | ----- | ----- |
| Maine Lobsters | lobsters.baselinestudio.org | Elite — full feature set (Supabase auth, Stripe payments, Resend email, coach/admin/parent dashboards) | ✅ Connected |
| Vermont Falcons | falcons.baselinestudio.org | Pro — video hero, static roster, auth, coach/admin dashboards, college commits | ✅ Connected |
| Connecticut Bluehawks | bluehawks.baselinestudio.org | Starter — fully public/read-only, no auth | ✅ Connected |

**Marketing site:** `baselinestudio.org` — single `index.html`, EmailJS contact form, GDPR cookie banner \+ legal pages (Impressum, Privacy Policy, Cookie Policy, Accessibility Statement), cream/maroon/sage palette, Playfair Display \+ Poppins fonts, portfolio section linking all three demo tiers.

**Shared Supabase project** (used across all demo sites):

* URL: `https://smerztswhvimsoinybps.supabase.co`  
* Anon key: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNtZXJ6dHN3aHZpbXNvaW55YnBzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg2MDkxMDcsImV4cCI6MjA5NDE4NTEwN30.pZapcYNJsTL7FhfgXXsfMi0ToHL6OoQbLAMRTl9N6Wo`

## **5\. Active / Warm Clients**

**MV Prospects** (Nashua, NH) — Isaiah runs their social media, a family member is co-owner. Priority prospect to upgrade to a full Baseline Studio build.

**Granite State Silverbacks** (Hudson, NH) — nonprofit youth baseball org, two teams (12U and 15U, Perfect Game League), run by one coach for his own two kids; families don't pay to play. Deployed at `gssilverbacks.baselinestudio.org`, will migrate to its own domain later. Real brand assets used throughout (neon yellow-green/black/white, Anton \+ Barlow Condensed), no placeholders. Point of contact: coach Billy (Billy Burrows, 15U / Director of Baseball Operations; Dylan Page coaches 12U). Referral came via Lance Hedquist. Venue: Greeley Field. Upcoming: Cooperstown All Star Village Tournament, August 2026, 12U team.

* Demo credentials: `coach@silverbacks.com / demo123`, `parent@silverbacks.com / demo123`.  
* Build approach: initial version needed to *visually* show a full backend exists (dashboard, roster management, login) without all of it being functional yet — same staged-demo approach used across the Elite/Pro/Starter tiers. Full backend (real auth, live dashboard, roster management) is a later phase.

**Merrimack Magic** (softball) — Merrimack, NH. Travel/tournament program under MYA Girls Softball (Merrimack Youth Association, volunteer-run nonprofit). Very low tuition, actively trying to grow → **this build does not include payment processing.** Three travel age brackets: 8U, 10U, 12U (USA Softball age rules), competing against Babe Ruth and USA Softball opponents. 12U/10U tryouts in fall with a fall schedule plus winter off-season training; 8U tryouts in spring. Main tournament season late April–July (6–8 tournaments). MYA Softball overall serves ages 5–18, phone 978-996-8881. Reference site `myasoftball.org` is a dated MYA-wide umbrella site (not Magic-specific). Front-page updates pull from the active Facebook page (`facebook.com/merrimackmagic`) via an embedded Page Plugin instead of a built-in news/CMS.

* **Status:** front-end build complete (About, Fields, Tryouts & Registration merged page, Coaches & Volunteers, Board of Directors, sponsor tiers, a board-meeting-minutes archive, Contact and Volunteer forms). **No live backend yet** — contact form, volunteer form, and sponsorship checkout are front-end only; nothing is actually saved or charged until Stripe/EmailJS (or equivalent) is wired in.  
* Real board meeting minutes were supplied and used to populate real content (a 91-player stat, a scholarship fund, an 8U fundraising need, an umpire transition) — proposed as changes for approval before being written in, which worked well for a large batch of real data; reuse this review-then-approve pattern for future large content drops.  
* A custom softball-icon graphic (used as the gallery's active-dot indicator) went through several hand-drawn SVG attempts before a real uploaded reference image replaced it entirely — see Section 9 for the technical fix once the image didn't initially render.  
* Registration and Tryouts were originally separate pages, then merged into one page with expandable sections at the client's request.  
* Demo/reference asset note: Claude cannot see the actual files in the client's local `assets` folder or render the live page visually — layout and image-crop issues on this build were reasoned through code, not seen, which is why several visual bugs (see Section 9\) took multiple rounds to resolve.

## **6\. Roadmap**

1. Build out MV Prospects as a real client site  
2. Finish building out Granite State Silverbacks (full backend: auth, live dashboard, roster management)  
3. Build out Merrimack Magic (no payment processing)  
4. Implement Stripe Connect for production tuition payment splitting (current Lobsters demo uses basic Stripe, not Connect)  
5. Develop broader prospect outreach strategy  
6. GameChanger API integration once a real client team provides API access — **Perfect Game has no public API, never promise live sync there.** GameChanger has an embeddable widget requiring the org's own account; build a clearly labeled "connect your account to enable this" placeholder for any integration the client doesn't have credentials for yet, never a page that implies it already works.

---

## **7\. Standing Technical Rules (every build, no exceptions)**

* Single `index.html` only — never split into multiple JS files.  
* `a, button, [onclick] { cursor: pointer }` in the CSS reset from day one.  
* Establish a primary/secondary/destructive button system before building any pages — no white/near-white button backgrounds. Dark-theme default: primary \= brand color background, secondary/back \= dark background with light border.  
* Never use `alert()` for user-facing messages — inline success/error only.  
* No emojis as section icons — use proper SVG icons (Lucide, Heroicons, etc.).  
* Video assets must be `.mp4` (H.264) — browsers don't reliably play `.mov`/QuickTime.  
* Test every nav and footer link after every build session — navigation is the skeleton of the site.  
* Dropdown nav needs CSS `:hover` on the *parent wrapper*, not just the button (gap between trigger and menu is a classic bug). If a nav item has both a page and a dropdown, clicking the text must navigate — never make a nav item a dead end.  
* Always confirm exact asset filenames (capitalization, spaces, no stray characters like a trailing `a`) before referencing them in code.  
* Any form field referencing a specific DB record (player, team, parent) must be autocomplete/dropdown, never free text.  
* Any operation affecting every row in a table needs an undo (session-scoped button \+ reverse SQL function is the proven pattern) and a password confirmation for destructive dashboard actions.  
* Mock/unbuilt features (payments, live schedule sync, etc.) must carry a clear "coming soon" / "demo mode" label — never look broken or falsely functional. Make the Stripe test card number (`4242 4242 4242 4242`) visible in demo mode.  
* **Add honeypot spam protection to every public-facing form** (Contact, Volunteer, Interest, Tryout Registration, etc.) — a hidden field real users never fill in but bots do; once built once it drops cleanly into any new form with no rework.  
* **Don't trust a third-party embed's own "responsive" resize script.** The Facebook Page Plugin (and similar embeds) claim to resize themselves via `adapt_container_width`, but this isn't reliable in practice, especially on mobile. The reliable fix: measure the container's actual rendered width with JS on load/resize, then rebuild the iframe's `src` URL with that exact width baked into the platform's own `width` parameter — don't rely on CSS `transform: scale()`, negative-margin clipping, or a plain relative-width iframe, all of which have failed to size these embeds correctly.

## **8\. Standing Design & Copy Rules**

* No em dashes anywhere — see Rule \#1 above.  
* No eyebrow labels above section headings.  
* No decorative watermark numbers or oversized quote marks.  
* No purposeless infinite-loop animations — entrance-only is fine; bidirectional scroll-reveal (animates back out on scroll-up) is the correct pattern.  
* No filler "about us" card grids unless requested.  
* Hero: headline \+ one CTA only — see Rule \#2 above. Don't duplicate the same CTA in nav and hero.  
* Footer nav links: vertical/stacked, not horizontal. Footer and nav logos should be sized prominently, not shrunk.  
* Stats/numbers shown in demos must be credible and meaningful in context, not filler — replace with descriptive copy if a number would feel fake.  
* Don't add decorative elements, icons, or extra dashboard tabs proactively — wait to be asked. Removing them after the fact means redoing spacing/layout.  
* Default body/label text to white or the brand accent color, not gray — reserve gray for genuinely secondary text (fine print, timestamps).  
* Multi-line body copy is left-aligned by default; center alignment is for short single-line headlines/CTAs only (centered multi-line paragraphs create a lopsided "off-center" illusion even when mathematically centered).  
* When nudging a photo `object-position`, make the first adjustment large/obvious, not a few px — small changes read as ambiguous or "backwards" even when technically correct. If a client says a direction is wrong, just reverse it rather than defending the math.  
* **Use far fewer boxes/cards overall.** Wrapping every single piece of content in its own bordered, shadowed, rounded container (a card for every stat, every testimonial, every feature, every roster row summary) is one of the fastest ways a site reads as templated rather than designed. Build hierarchy with type scale, spacing, dividers, and alignment instead of a box around everything. Reserve an actual card/box treatment for content that's genuinely a distinct, repeatable record — a single player row, a single schedule game, a single news item — not for every section of the page by default. **Reusable pattern:** a shared divider-list layout (a `.dlist`/`.drow` pair — a list of horizontal rows separated by a hairline divider instead of individually boxed cards) cut the total box count by more than half across the Board of Directors, sponsor tiers, Fields, Tryouts, and Coaches pages on the Merrimack Magic build. Reuse this pattern by default for any list of similar items instead of reaching for a card grid.

### **AI-Generated Design Tells — None of These Belong in Any Build**

*(Now grounded in the actual source article, plus the previously compiled general list below it.)*

**1\. Predictable, repeated layout skeletons.** AI design tools converge on the same page structure almost every time regardless of the actual subject: top navbar, centered hero with CTA buttons, a dashboard-style widget section, a grid of feature cards, a stats/metrics strip, a 3-card pricing layout, a testimonial grid. Relying on this exact skeleton for every client site (Lobsters, Falcons, Bluehawks, Silverbacks, Merrimack Magic) is the fastest way for the whole portfolio to start looking interchangeable. Each site's structure should come from what that specific org actually needs to communicate, not a default template repeated across builds.

**2\. Generic visual identity.** This is the "average good-looking interface" problem — a design that looks polished but is instantly forgettable because it's built from the same safe defaults every time: default sans-serif fonts with oversized headings, heavy gradients (neon for anything meant to feel "innovative," pastel for everything else), soft shadows and glow effects meant to fake depth, the identical SaaS hero of badge \+ headline \+ CTA buttons, oversized rounded corners on everything, and stock-style 3D illustrations. Several of these are already covered as hard rules elsewhere in this guide (no gradients-as-default, no oversized rounded corners applied uniformly, no eyebrow badges above headlines) — this is the underlying reason for those rules, not a separate concern.

**3\. Weak UX logic across a full flow, even when individual pages look fine.** AI-generated design is much stronger at a single screen than at a coherent system: pages that look good in isolation can conflict once strung into an actual user flow, edge states get missed (a button with no real next step), interaction patterns go inconsistent screen-to-screen, and navigation that looks clean can quietly break usability. This is directly relevant to these multi-page club sites — after building each page, walk the *actual* flow a parent or coach would take (home → tryout interest form → confirmation → portal login → dashboard, etc.) rather than just checking each page individually. A new page or feature must be checked against how it connects to what already exists, not just judged on its own.

**4\. Vague microcopy.** AI-written copy tends to sound polished while saying almost nothing — generic lines like "Boost Your Workflow," "Streamline Your Experience," or "Unlock Productivity" that could apply to any product in any industry. This reinforces the existing buzzword rule below, but the deeper fix is to write copy tied to the specific org's actual context — its real teams, its real coach's name, its real league, its real season — rather than a slogan that's technically on-topic but generic enough to belong to any club site.

**5\. Missing product constraints.** Left to its own devices, AI design tends to ignore the real-world constraints that shape an actual product: technical/engineering limits, business requirements, accessibility rules, legal restrictions, localization, existing technical debt. This is exactly why the pre-build checklist in Section 13 (lock the page list, feature list, data model, and role model before writing code) exists — those constraints need to be stated explicitly up front for a given client, not left for the design to guess at or ignore.

**Previously compiled list (broader, general AI-design-tell patterns worth still avoiding):**

* Purple-to-blue or pink-to-purple gradient backgrounds, buttons, or blobs — the single most common "this was made by an AI tool" signal.  
* Glassmorphism / frosted-glass cards layered over a gradient background.  
* Decorative blob or wavy SVG shapes used as background filler with no connection to the subject.  
* Numbered "01 / 02 / 03" step markers used decoratively even when the content isn't a real sequence — only legitimate when order actually carries meaning (a real process, a timeline).  
* Icon-in-a-circle \+ bold heading \+ one-sentence paragraph, repeated identically across a 3- or 4-column grid, for every single feature or benefit.  
* Defaulting to the same two or three fonts (Inter/Poppins for everything) with no real typeface pairing or personality.  
* Generic stock photography (diverse professionals laughing at a laptop) or generic isometric 3D illustrations that could belong to literally any company.  
* A sparkle/star icon used as shorthand for "AI" or "smart" features.  
* Perfectly symmetrical, centered-everything layouts with no real focal point or visual tension.  
* Testimonial carousels with circular avatar placeholders and vague, interchangeable quotes.  
* An endless single-page scroll that alternates left-image/right-text then right-image/left-text sections at an identical rhythm all the way down.  
* Excessive scroll-triggered animation on every individual element (fade/slide-up on every line) instead of one deliberate, orchestrated moment.  
* The three specific palettes AI tools currently default to, applied regardless of subject rather than as a deliberate choice for the brief: (1) warm cream background with a high-contrast serif and a terracotta/clay accent, (2) near-black background with a single bright acid-green or vermilion accent, (3) broadsheet-style layout with hairline rules, zero border-radius, and dense newspaper columns. Any of these is fine *if it's the right call for a specific client's brand* — the tell is using one of them by default, for every client, regardless of who they are.

---

## **9\. Recurring Bug Patterns & Fixes**

**Date/timezone bug:** never call `.toISOString()` for date logic — it converts to UTC and shifts dates back a day for US timezones (a "July 3" game gets stored as "July 2"). Always use a `fmtLocalDate()` helper for local date formatting/comparison.

**Reveal animations silently invisible:** always call `initReveal()` (or `setTimeout(initReveal, 50)`) after *any* `innerHTML` update containing `.rv`, `.rv-l`, `.rv-r`, or `.stagger` elements — the IntersectionObserver never reattaches on its own, so elements stay at `opacity:0` permanently with no console error.

**Missing wrapper ID breaks everything scoped to it, silently:** if a container is referenced by ID-scoped selectors (`#coachdash ...`), the actual `id="..."` attribute must be physically present on that DOM node — a `data-page="coachdash"` attribute alone is not enough. `querySelector` returns null and `querySelectorAll` returns an empty list with zero console errors, so this can present as several unrelated-looking bugs (empty roster, tabs not switching, buttons doing nothing) that are actually one root cause. Always verify the ID is present, don't assume it from a similarly-named attribute.

**Percentage width/height inside an auto-sized parent silently falls back to browser defaults:** e.g. `height:100%` on an image inside a CSS Grid row sized `auto` has nothing definite to resolve against, so it collapses to a minimum height; `width:100%` on an iframe inside a flexbox child with no explicit width falls back to the browser's built-in \~300px default. Use definite lengths, or let flex/grid `stretch` handle sizing — don't fight it with percentages on the child.

**JS syntax errors from splicing data blocks:** injecting new data into an existing file via line-number splicing can leave a stray closing `};` from the replaced block, silently breaking the entire script (page renders with nothing interactive, no visible error). Always verify line boundaries and run `node --check` on extracted script blocks before delivering, especially after any splice.

**Cross-origin iframes (Facebook Page Plugin, etc.) can't be styled by page CSS** — this is a Same-Origin Policy boundary, not a bug. The only real fix is optical: clip with an `overflow:hidden` wrapper slightly smaller than the iframe, keeping the iframe itself at its exact natural/intended size. Never resize the iframe's own CSS box to "fix" cropping — that causes the widget to reflow at a different size and can cut into real content. Also: `file://` origins can cause third-party embeds to reject the request outright (403) independent of any CSS issue — always test embeds through a local server, never by double-clicking the HTML file.

**Numeric vs. string ID mismatches:** e.g. a `teams` table using numeric IDs (1–11) while code passes string IDs like `'9U'` — works fine until it silently doesn't (rosters stop loading). Decide on an ID format on day one and stay consistent; use `String(id)` comparisons when in doubt.

**Wide tables overflow the whole page on mobile:** wrap wide tables (e.g. roster management with an action-button column) in their own `overflow-x:auto` container scoped to the table, so the page itself never scrolls horizontally. Native scrollbars are easy to miss — add an explicit scroll hint (icon \+ label) above the content when it hides interactive elements.

**`overflow-x:auto` on a flex tab container** causes a stray horizontal scrollbar — use `flex-wrap` for tab containers instead.

**Role lookups that fail silently:** if a role query (e.g. from `user_roles`) returns null due to RLS or a missing row, don't silently default to a role like `parent` — this hides real bugs and makes broken auth look like it's working. Default to `null` and surface a visible error, and `console.log` the result during development.

**Precise decorative placement needs hand-tagged elements, not positional selectors or automated math.** When a visual result has to look right (e.g. star placement in a hero background), `nth-of-type` selectors and even real collision-detection math measuring actual DOM text position are both less reliable than they sound — `nth-of-type(even)` assumes an alternating left/right pattern in the underlying list that may not actually exist, silently skewing which elements get hidden on mobile, and geometrically "correct" collision avoidance can still look wrong. Tag each element individually with a specific class (e.g. `mobile-hide-star`) so placement can be controlled directly, rather than relying on list position or automated logic to get a visual judgment call right.

**A bug appearing in multiple unrelated-looking places often traces back to one shared base class.** A hardcoded `max-width` on a shared `.lede` paragraph class caused a "text stopping halfway across the page" bug that was reported on one page, then another, then flagged as site-wide — and was fixed piecemeal 2-3 times on individual paragraphs before the shared class was checked. When the same visual symptom shows up in unrelated sections, check for a shared class before patching each instance separately.

**Flex children need an explicit width, or their position shifts with content length.** A wrapping text `<div>` inside a flex row with no defined width will shift position depending on how much text it contains, rather than lining up consistently row to row — give it a definite width (or use grid) rather than leaving it to shrink/grow implicitly.

**`justify-content: space-between` in a shared row layout can misalign rows inconsistently.** Applied to a shared `.drow` layout used for both short and long text content, it caused visually inconsistent alignment between rows depending on how much text was in each one — not obvious until different rows are compared side by side. Worth checking any shared row/list component against its longest and shortest realistic content, not just one example.

**CSS selectors scoped to a specific tag silently stop matching when the tag changes.** A CSS rule that showed the "active" state icon only targeted `<svg>` elements (from an original hand-drawn icon); after switching to an uploaded `<img>` reference image, the rule never matched the new tag, and the active icon just showed as a blank circle with no console error. Whenever an asset's underlying tag type changes (SVG → img, div → button, etc.), re-check any CSS/JS that was scoped to the original tag.

---

## **10\. Auth & Invite Flow (fixed pattern — preserve across all builds)**

1. **Never use `supabase.auth.admin.inviteUserByEmail()` for a custom invite flow.** It creates the auth user *and* sends an email in one step — re-inviting or testing the same address then throws "User already registered." If it's already been used to create the user, complete account setup with `sb.auth.updateUser({password})`, **not** `sb.auth.signUp()` (calling `signUp()` on an already-invited email silently fails/conflicts).  
2. **Use Resend \+ a DB-stored token table (`portal_invites`) from day one instead**, with `?param=` query tokens — never `#hash=` (Supabase appends its own `#access_token=...` to redirect URLs and will clobber anything put in the hash).  
3. Password recovery links return with `?type=recovery` as a **query param**, not a hash — detect with `urlParams.get('type')==='recovery'`, show a reset modal, call `sb.auth.updateUser({password})`. Also handle the `PASSWORD_RECOVERY` event in `onAuthStateChange` as a backup.  
4. After `updateUser()` on an invited user, call `onLogin(user)` directly — no confirmation email needed since the invite already verified the email.  
5. Keep **Confirm email ON** in Supabase Auth — turning it off causes "User already registered" errors on `signUp`.  
6. Store invite tokens in `portal_invites` rather than relying on Supabase's one-time tokens — DB tokens are reusable, inspectable, and don't expire unless you want them to.  
7. **Supabase's built-in email service is not viable even for moderate testing** — hits rate limits almost immediately. Set up Resend (custom SMTP) *before* testing any invite/auth flow, not as an afterthought.  
8. Test invite/auth flows in an **incognito window** — an existing admin session will intercept the flow in a normal window.  
9. Set the Supabase **Site URL** to the live Netlify URL (not localhost), add that URL to **Redirect URLs**, and make sure any Edge Function's `redirectTo` points to it — do this *before* sending a single test invite.  
10. **Always keep a demo fallback login** (hardcoded credentials, `DEMO_FALLBACK=true`) so the site is demoable even when real Supabase auth or RLS is broken. But: never assume a credential exists just because it's written in the UI — actually seed it in Supabase Auth (a `coach@falcons.com` account was referenced but never created in one build, breaking the demo login).

## **11\. Supabase Backend Setup Checklist (run for every new table)**

**GRANT and RLS are two separate things — both are required:**  
 GRANT SELECT, INSERT, UPDATE, DELETE ON public.your\_table TO anon, authenticated;GRANT USAGE, SELECT ON SEQUENCE public.your\_table\_id\_seq TO anon, authenticated;ALTER TABLE public.your\_table DISABLE ROW LEVEL SECURITY; \-- demo/internal tables only

1. Forgetting the sequence grant causes a confusing "permission denied for sequence X\_id\_seq" error that looks unrelated to the real cause. Re-run GRANTs any time a table is created or a column is added — keep a master SQL file of all GRANTs that can be safely re-run anytime.  
2. **Never disable RLS on a table with real PII** (parent emails/phones, payment info) on a live client build — the anon key is public in the page source. Write real policies instead: parents see only their own data, coaches see only their team, admins see everything.  
3. `auth.uid()` / `auth.email()` always return null in the Supabase SQL Editor — don't try to test RLS policies there, test from the actual site.  
4. Never put the **service role key** in frontend code. Anything needing admin-level access (creating auth users, sending invites, deleting accounts) goes through an Edge Function, set up on day one.  
5. `supabase login` via browser can be finicky — use `supabase login --token sbp_...` with a personal access token (shown only once, copy immediately).  
6. The "Docker is not running" warning during `supabase functions deploy` is harmless — functions still deploy.

Edge Function logs in the dashboard often just say "shutdown" with no real error. To see the actual error, call the function directly:  
 try { Invoke-WebRequest \-Uri "https://YOUR\_REF.supabase.co/functions/v1/YOUR\_FUNCTION" \-Method POST \-Headers @{"Content-Type"="application/json"; "apikey"="YOUR\_ANON\_KEY"} \-Body '{"key":"value"}' } catch { $\_.Exception.Response.GetResponseStream() | % { $r \= New-Object System.IO.StreamReader $\_; $r.ReadToEnd() } }

7.   
8. Before deploying an Edge Function, open the local file and confirm it has the expected code — the wrong/stale version has been deployed more than once.  
9. Cascade deletes are not automatic — deleting a player must also be coded to clean up related rows (`parent_players`, and conditionally `user_roles`), or you get orphaned records and a parent who keeps portal access after their kid is removed.  
10. `RAISE NOTICE` (or any procedural statement) outside a `DO $$` block or function is invalid Postgres and fails the whole script — use `SELECT 'Setup complete' AS status;` instead if a completion message is wanted.  
11. Array-type Postgres columns (e.g. `schedule_events.teams` as `TEXT[]`) don't filter with a simple SQL `WHERE` via PostgREST — handle filtering client-side with `.includes()`, or use Supabase's `cs` (contains) operator. Pick one approach and document it.  
12. Seed at least 3–5 rows of every content table (including `parent_players` links to a real, working auth account) so demos never look broken from empty tables — and seed at least one admin account into `user_roles` before handoff, since the first thing anyone does is log in and try everything.

## **12\. Netlify Deployment**

* Requires a **folder**, not a bare file — put `index.html` inside a folder before dragging it in. Filename must be exactly `index.html`.  
* Free plan \= 300 credits/month, 15 credits/deploy → 20 deploys max/month. Most testing can be done locally (double-click `index.html`, or Live Server); only deploy for a live URL when actually needed (invite links, client demos). For a real client project, start on the $9/month Personal plan (\~66 deploys/month).  
* After every deploy, immediately test login with all demo accounts — auth breaking silently has been the single most common issue across builds.

## **13\. Process & Client Onboarding**

**Before writing any code on a new build, lock in and confirm with the client:**

1. Full page list, one sentence per page  
2. Feature list split into launch-required vs. post-launch ("visual only for now" vs. "build for real later")  
3. Data model — what tables exist, what they contain, how they relate  
4. Role/access model — who can do what, who can sign up vs. who assigns access (don't build a "Sign Up" nav button if access is coach-assigned, not self-service)

Changes made mid-build are far more expensive than changes agreed in the planning doc.

**Recommended build order for a new client:**

1. Create Supabase project → create all tables → run all GRANTs and RLS decisions immediately  
2. Deploy Edge Function with the correct redirect URL from day one  
3. Set up Resend (custom SMTP) before testing any invite email  
4. Deploy to Netlify  
5. Update Supabase Site URL and Redirect URLs to the live Netlify URL  
6. Test the full invite → set password → login flow before showing the client anything

**Other standing process rules:**

* Never design a workflow assuming Claude can make outbound API calls directly from its sandbox (it can't reach most external hosts) — hand the client a SQL script to run themselves in the Supabase dashboard, tested for syntax first.  
* Always upload/reference the current live file at the start of every session — edits applied to a stale version have caused real regressions. Version files during development (`v1`, `v2`...) and never overwrite a previous version until the new one is confirmed working; use the most recent output file as the base, never a previously uploaded one.  
* Ask about data-model edge cases (e.g. "can a parent have more than one child?") before building auth/profile pages — the answer changes the model.  
* Prefer real-browser (Playwright) validation for layout/visual checks over jsdom, which lacks `scrollBy`, `IntersectionObserver`, etc. — this has caught real bugs that code review alone missed.  
* Surgical/minimal edits only — never touch a section that wasn't asked about while fixing something nearby.  
* Nail down "who pays for what, and how" explicitly before building any payment-adjacent UI — cost/payment model changes tend to touch multiple pages at once (public page, coach dashboard, parent portal) and are expensive to redo.  
* Sort feeds (news, announcements) programmatically by date rather than relying on manual array order, to avoid needing to manually re-position items later.  
* Test on mobile before calling any version done.  
* **When a client uploads real source material in bulk** (meeting minutes, a spreadsheet, an old master doc), propose the resulting content changes for approval *before* writing them into the live file, rather than committing a large batch of real data changes directly — this worked well for populating real content (a player-count stat, a scholarship fund, a fundraising need) accurately.  
* **Ask for a real reference image early for anything with a specific visual identity** (a custom icon, a logo mark, a specific crop) instead of iterating through hand-drawn or generated attempts — a single uploaded reference image ended a multi-round back-and-forth on the Merrimack Magic softball icon that several rounds of description-based redraws hadn't resolved.  
* **Claude cannot see local image assets or render the live page visually** — every layout, crop, and spacing judgment is reasoned through code, not seen. This is why some visual bugs take multiple rounds: debugging is happening blind, relying on the client's description each time. Screenshots or precise before/after descriptions speed this up considerably; this is an inherent limitation of the tool, not a sign something was done carelessly.  
* **When merging near-duplicate pages/nav items into one** (e.g. a "Registration" and "Tryouts" page merged into a single page with expandable sections), audit and update every internal link that pointed to the old separate page/nav item — easy to miss one and leave a dead link.  
* **Proactive additions are fine specifically when the client invites it** — e.g. asked to look for gaps or opportunities in uploaded source material (meeting minutes) and add pages/sections based on what's found there. Outside of that kind of explicit invitation, the standing rule still applies: don't add pages, tabs, or sections proactively, wait to be asked.  
* **Internal-only/concept pages** (e.g. a sponsorship checkout draft built as a sales/planning tool) should be clearly labeled as a concept and never linked in the main nav — same standard as any other mock/unbuilt feature.

**Client pitch notes:**

* Lead sales demos with the coach dashboard / admin controls — most orgs are currently using GroupMe and a Google Sheet, so a real admin panel with live data is immediately compelling.  
* The core value proposition is the managed-service angle: Isaiah handles all updates, content changes, and technical issues, framed as "you just tell us and we handle it."  
* If the invite flow is working, demoing it live (type a parent's email, they get a real email in seconds) is a strong moment — verify it works before every sales call.  
* Set expectations early on anything not yet built (Stripe Connect, GameChanger sync): "that's in the next phase," never demo it as if it already works.

---

## **14\. Legal & Compliance Review — Standing Requirement Before Any Real Client Handoff**

Added after the Granite State Silverbacks build: this is the first build being handed to an actual client contact (coach Billy) rather than kept as an internal portfolio demo, and the first time the business has had to seriously confront cross-border data and payment questions. **Going forward, treat legal/tax review as a required pre-handoff step for every real client, not just Silverbacks.**

**Current status (Silverbacks):** site is feature-complete and ready to send to Billy from a build-quality standpoint. Natalie is doing the legal/compliance review before this is treated as a live production handoff. Two reference documents support this review:

* `Silverbacks_Handoff_Legal_Research_Checklist.md` — what Isaiah needs to research/flag before sending the site, and what Natalie needs to run down legally.  
* `Baseline_Studio_Tax_Advisor_Questions.md` — questions for Natalie to bring to a German tax advisor (Steuerberater) given the business is a Freiberuflerin registered in Bavaria serving only US clients.

**Headline issues that apply to every future client, not just Silverbacks (see checklist for detail):**

* Baseline Studio is EU-established, which means **GDPR applies to any personal data it processes regardless of where the data subjects (US families/kids) live** — this is not optional just because clients are American.  
* Sites collect data on minors (rosters, photos, emails) — US COPPA considerations apply in addition to GDPR.  
* Stripe Connect puts Baseline in the middle of client payment flows — merchant-of-record and liability responsibilities need to be explicit in a written agreement per client, not assumed.  
* No formal written client service agreement exists yet for any build — this is a gap for every client, not just Silverbacks.  
* Freiberufler vs. Gewerbe classification for web/software work is a known German tax gray area worth confirming directly rather than assuming.

*(Not legal advice — bring the specifics of Sections 15 and 16 below to Natalie and a lawyer before treating them as settled. These are meant as a working checklist so nothing gets missed, not a substitute for professional review.)*

---

## **15\. GDPR Compliance — Standard Practice for Every Build**

Baseline Studio is EU-established, so GDPR applies to all personal data it processes regardless of where site visitors or families are located — this needs to be treated as standard practice on every build, not a Silverbacks-specific concern.

* **Lawful basis for processing:** before adding any form field or DB column that stores personal data, know why it's being collected (consent for photos, legitimate interest/contract for basic roster management) rather than collecting it because it might be useful later.  
* **Data minimization:** only collect fields actually needed for the stated purpose — resist adding "nice to have" personal fields to forms or tables.  
* **A privacy policy per site**, not just Baseline's own marketing-site policy — each client site needs its own notice describing what's collected, why, how long it's retained, and who to contact about it.  
* **Real consent, not implied consent:** freely given, specific, informed, unambiguous. A pre-checked box or a buried "by using this site you agree" line doesn't count. Photo/roster consent should come from the parent directly — not assumed from a team's public Facebook post.  
* **Data subject rights**, with an actual documented way to fulfill each one (even if the mechanism for a small client is just "email us"): access, rectification, erasure ("right to be forgotten"), restriction of processing, data portability, objection.  
* **Retention limits:** define how long a player/family's data is kept after they leave the org, and actually delete or anonymize it at that point instead of keeping it indefinitely by default.  
* **Security by design:** proper Supabase RLS policies, admin-only access to PII tables, and never putting the service role key in frontend code (see Section 11\) satisfy GDPR's security-of-processing requirement directly — this is not just engineering hygiene, it's a compliance requirement.  
* **Data Processing Agreement (DPA):** where the client org is the data controller and Baseline is processing data on their behalf, there should be a written DPA covering what Baseline can/can't do with the data and what happens to it if the relationship ends.  
* **Breach notification awareness:** know the process for handling a data breach (72-hour notification window under GDPR) even for a small, demo-stage site — better to have a plan before it's ever needed.  
* **Lightweight internal record-keeping:** keep a simple record of what personal data each client site collects and why. Doesn't need to be a formal enterprise-grade Article 30 record for a business this size, but having it written down makes every future legal review (see Section 14\) much faster.

## **16\. COPPA Compliance — Youth Sports Sites Specifically**

Every Baseline Studio client is a youth sports org, so some or all users are under 13 — COPPA applies in the US on top of GDPR, and needs the same standard-practice treatment across every build:

* **Verifiable parental consent** before collecting personal information directly from a child under 13\. In practice: every form should be filled out by, and addressed to, the parent about the child — never presented as if the child is submitting it themselves.  
* **Clear privacy notice** describing exactly what's collected from or about children, how it's used, and whether it's shared with any third party. This can overlap with the GDPR privacy policy above if written to cover both.  
* **Parental rights, with a real mechanism:** a parent must be able to review what's been collected about their child, request deletion, and refuse further collection — the site or dashboard needs an actual documented way to do this.  
* **Data minimization:** collect only what's reasonably necessary for the activity (jersey size, emergency contact for a roster) — not unrelated personal details.  
* **Photos/videos of an identifiable child, especially combined with a name, count as personal information under COPPA.** The current pattern of pulling photos from a team's public Facebook page needs a real answer on whether that constitutes sufficient parental permission — "it was already public on Facebook" is not automatically "cleared for any use," and this should be resolved per client rather than assumed (see the Silverbacks legal checklist for the specific open question).  
* **Retention and deletion:** don't keep a child's personal information longer than reasonably necessary for the purpose it was collected for.  
* **Third-party embeds can trigger COPPA obligations too:** the Facebook Page Plugin (or any analytics script) embedded on a site used by children may itself collect data from visitors — worth checking what these embeds actually capture, not just assuming they're passive.  
* **Never condition participation on excess disclosure:** don't require a parent to hand over more personal information than necessary just to let their child participate — e.g. don't gate a public roster or schedule behind an unnecessarily invasive signup form.

