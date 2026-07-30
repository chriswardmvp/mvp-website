# Baseline Studio — Standing Rules

Full reference: see master-guide-full.md in this folder for legal/GDPR/COPPA
detail, Supabase auth patterns, and the complete bug-pattern log. Read that
file only when a task actually touches those areas (payments, auth, legal
pages) — don't load it by default.

## Rules broken most often — check these first, every build
1. NO EM DASHES. ANYWHERE. Not in HTML, not in JS-generated content, not in
   copy adapted from client material. Use a comma, period, colon, or reword.
   Mandatory before delivery: grep the file for &mdash; and the — character.
2. HERO = ONE HEADING + AT MOST ONE SINGLE-LINE CTA. Nothing else. No eyebrow
   label, no badge, no floating stat box, no secondary tagline, no duplicate
   CTA in nav+hero. Treat any addition here as scope creep by default.
3. NEVER inline data into onclick="..." strings (or onmouseover, or any
   inline handler in a JS template string). Use index-based lookups into a
   global array instead — nested quotes cause silent innerHTML failures.
4. VERIFY SUPABASE COLUMN NAMES before writing any INSERT/SELECT. Run
   `SELECT column_name FROM information_schema.columns WHERE table_name = 'x'`
   for every table first. Schema drift is real — re-verify even old tables.

## Architecture
- Single index.html per client. Inline CSS/JS. No build tools, no split files.
- Backend: Supabase (Postgres, Auth, Edge Functions).
- Payments: Stripe / Stripe Connect. Email: Resend (transactional), EmailJS
  (contact forms). Deploy: Netlify, folder containing index.html, exact name.

## Standing technical rules
- `a, button, [onclick] { cursor: pointer }` in the reset from day one.
- Button system (primary/secondary/destructive) before building any pages —
  no white/near-white backgrounds.
- Never alert() for user messages — inline success/error only.
- No emoji icons — use SVG.
- Video must be .mp4 (H.264), not .mov.
- Dropdown nav: hover on the wrapper, not just the button.
- Confirm exact asset filenames (case, spaces) before referencing in code.
- Any DB-record form field (player/team/parent) = dropdown/autocomplete, never
  free text.
- Mock/unbuilt features need a visible "coming soon"/"demo mode" label —
  never look broken or falsely functional.
- Honeypot field on every public form.
- Never trust a third-party embed's own resize script (e.g. Facebook Page
  Plugin) — measure container width with JS and rebuild the iframe src with
  it baked in.
- Never use toISOString() for date logic — use local date formatting
  (fmtLocalDate) to avoid UTC shift.
- Call initReveal() after any innerHTML update containing .rv/.rv-l/.rv-r/
  .stagger elements.
- Test every nav/footer link and mobile view every session.
- Run node --check on extracted script blocks before delivery.
- Any new photo asset added to the project (client-supplied JPG/PNG) needs a
  generated .webp sibling before it ships: resize to a sane max dimension
  (~1600px on the long edge) if larger, save at quality ~80, and reference it
  with the onerror-fallback-to-original pattern already used site-wide. Do
  this automatically whenever a new image file shows up, don't wait to be
  asked.

## Standing design & copy rules
- No eyebrow labels above section headings.
- No decorative watermark numbers or oversized quote marks.
- No purposeless infinite-loop animation — entrance-only, bidirectional
  reveal on scroll.
- No filler "about us" card grids unless requested.
- Footer nav links stacked vertically, not horizontal.
- Stats shown must be credible, not filler.
- Don't add decorative elements or tabs proactively — wait to be asked.
- Body/label text defaults to white or brand accent, not gray (gray is for
  genuinely secondary text only).
- Multi-line body copy left-aligned; center only short single-line headlines.
- Prefer a divider-list layout (.dlist/.drow) over a card grid for repeated
  items (board members, sponsors, roster rows) — reserve real cards for
  genuinely distinct records.

## AI-design tells to avoid
No purple/blue or pink/purple gradients. No glassmorphism. No decorative
blob shapes. No decorative 01/02/03 markers unless order is real. No
icon-in-circle + heading + one-liner repeated across a feature grid. Don't
default to Inter/Poppins for everything. No generic stock photography or
sparkle/star "AI" icons. No testimonial carousels with vague quotes. Don't
default to the same 2–3 AI palettes (cream+terracotta / near-black+acid-green
/ broadsheet-hairline) unless it's the deliberate right call for this client.

## Process
Before writing code: lock page list, feature list (launch vs. later), data
model, and role model using the client's intake-brief.md. Do the design token
pass (palette/type/layout/signature) and get it approved before touching any
page content. Surgical edits only — never touch a section not asked about.
