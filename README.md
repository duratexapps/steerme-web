# Steer Me Web

First piece of Steer Me's move off Wix: a real Next.js placeholder announcing
the app and this web version are both still in development, with a working
email waitlist. Not the full product yet - task #18 (the actual Steer Me web
experience) is separate, larger work. This is just enough to have something
real deployed at `steerme.ropingtools.com`.

## Why this exists

Discussed at length in the `ropingtools-site` repo's `docs/ARCHITECTURE.md`:
the Wix-hosted version of Steer Me web (`backend/steerme/*.jsw`, built
against Wix Data Collections) was never going to genuinely share data with
the native app's real Supabase backend - Wix Data and Supabase are separate
systems. This project moves the Steer Me *web* experience to a stack that
can talk directly to the same Supabase project the native app already uses,
via a subdomain (`steerme.ropingtools.com`) rather than a Wix page - the
root domain, Coaching, and Draw Pro all stay on Wix exactly as they are.

## Waitlist backend

Deliberately **not duplicated here**. This page's waitlist form calls the
exact same Wix HTTP Function already built and tested for the Wix-hosted
version of this same page
(`https://www.ropingtools.com/_functions/joinSteerMeWaitlist`, backed by
`backend/steerMeWaitlist.jsw` and the `SteerMeWaitlist` Data Collection in
the `ropingtools-site`/`roping-tools` repos). CORS on that endpoint is
already open, so a cross-origin call from this subdomain works with zero
backend changes. There was no reason to stand up a second waitlist system
just because the frontend moved to a different stack - see the note in
`ropingtools-site/docs/ARCHITECTURE.md` about avoiding exactly this kind of
unnecessary duplication.

**One thing to confirm before this actually works end-to-end**: the
`SteerMeWaitlist` collection needs to actually exist in Wix (Content Manager
→ "Start from scratch", not CSV import - see the Collection ID gotcha
documented in `ropingtools-site/data-collections/SCHEMA.md`). If it doesn't
exist yet, the waitlist form will fail with a clear error rather than
silently doing nothing, but nobody will actually get signed up until it's
created.

## Local development

```bash
npm install
npm run dev
```

## Deployment

Deployed via Vercel, connected to whichever GitHub repo this gets pushed to.
Once deployed:

1. In Vercel: assign `steerme.ropingtools.com` as a custom domain on this
   project.
2. Vercel will show the exact CNAME record needed.
3. Add that CNAME in Wix's own DNS Records panel (Settings → Domains →
   ropingtools.com → CNAME section) - confirmed via nameserver lookup that
   Wix (`ns4`/`ns5.wixdns.net`) is the actual DNS host for this domain, not
   a third-party registrar, so the record goes there.

The root domain, `www`, `/coaching`, and `/drawpro` all stay exactly as they
are on Wix - this only ever affects the `steerme` subdomain specifically.
