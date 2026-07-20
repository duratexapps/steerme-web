import { useState } from 'react';
import Head from 'next/head';

// Reuses the exact same Wix HTTP Function already built and proven working
// for the Wix-hosted version of this page (public/steerme/index.html in the
// ropingtools-site repo) - backend/steerMeWaitlist.jsw + the
// post_joinSteerMeWaitlist endpoint in backend/http-functions.js. CORS on
// that endpoint is already open (Access-Control-Allow-Origin: '*'), so a
// cross-origin call from this separate steerme.ropingtools.com subdomain
// works without any backend changes - no reason to duplicate that logic
// here just because the frontend moved to a different stack.
const WAITLIST_ENDPOINT = 'https://www.ropingtools.com/_functions/joinSteerMeWaitlist';

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export default function Home() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({ message: '', type: '' });
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus({ message: '', type: '' });

    if (!isValidEmail(email)) {
      setStatus({ message: 'Enter a valid email address.', type: 'error' });
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(WAITLIST_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error((data && data.error) || 'Something went wrong.');
      }
      setStatus({
        message: data && data.alreadyJoined
          ? "You're already on the list - we'll email you when Steer Me launches."
          : "You're on the list! We'll email you when Steer Me launches.",
        type: 'success',
      });
      setEmail('');
    } catch (err) {
      setStatus({
        message: 'Something went wrong: ' + (err && err.message ? err.message : 'try again in a moment.'),
        type: 'error',
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Head>
        <title>Steer Me - Coming Soon | RopingTools</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Work+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        {/* This subdomain is a separate Vercel-hosted app - it does NOT
            inherit Wix's site-level favicon setting. Without this, it
            would show a generic default icon in the browser tab. */}
        <link rel="icon" type="image/png" href="/favicon-512.png" />
      </Head>

      <main className="card">
        <div className="logo-row">
          <svg width="30" height="30" viewBox="0 0 60 60" aria-hidden="true">
            <path d="M14 34 A18 18 0 1 1 32 52" fill="none" stroke="#D85A30" strokeWidth="5" strokeLinecap="round"/>
            <path d="M32 52 Q46 60 56 40" fill="none" stroke="#D85A30" strokeWidth="5" strokeLinecap="round"/>
          </svg>
          <div>
            <div className="logoWordmark">Roping<span>Tools</span></div>
            <div className="logoTagline">DRAW &middot; COACH &middot; COMPETE</div>
          </div>
        </div>
        <div className="badge">Coming Soon</div>
        <h1>Steer Me</h1>
        <p className="body-text">
          Steer Me will let you find and lock in your own partner ahead of time - no draw-in
          fee, no luck of the draw. Producers get entries who show up ready to pay, not owing
          it out of their winnings.
          <br />
          <br />
          It&apos;s not live yet - <strong>the app and this web version are both still in
          development</strong>. Leave your email and we&apos;ll let you know the moment either
          one launches.
        </p>

        <form className="waitlist-form" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="you@example.com"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={submitting}
          />
          <button type="submit" disabled={submitting}>
            {submitting ? 'Submitting...' : 'Get Notified'}
          </button>
        </form>
        <div className={`waitlist-note ${status.type}`}>{status.message}</div>

        <div className="links">
          <a href="https://www.ropingtools.com" target="_top" rel="noopener">
            Back to RopingTools
          </a>
        </div>
      </main>

      <style jsx global>{`
        :root {
          --tan: #e4dac6;
          --tan-light: #fbf8f1;
          --leather: #1e140f;
          --leather-dark: #120c08;
          --rust: #a9812e;
          --rope: #7c6448;
          --ink: #2a2420;
          --cream: #f4efe4;
          --green: #4b5a3c;
          --brass-light: #c9a54f;
          --oxblood: #5c2430;
        }
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        body {
          font-family: 'Work Sans', sans-serif;
          background: var(--leather);
          background-image: radial-gradient(
            circle at 90% -10%,
            rgba(169, 129, 46, 0.35),
            transparent 60%
          );
          color: var(--cream);
          min-height: 100vh;
        }
      `}</style>

      <style jsx>{`
        main {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2rem 1.5rem;
          max-width: 560px;
          margin: 0 auto;
          text-align: center;
        }
        /* Same logo treatment as the Wix-hosted version of this page and
           Draw Pro's coming-soon page - icon and "Tools" keep their
           specified original colors, "Roping" and the tagline are
           lightened for legibility against this page's dark --leather
           background (the originals were designed for a light
           background, per the landing page header). */
        .logo-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.6rem;
          margin-bottom: 1.5rem;
        }
        .logoWordmark {
          font-family: 'Playfair Display', serif;
          font-weight: 700;
          font-size: 1.15rem;
          color: var(--cream);
          line-height: 1.1;
          text-align: left;
        }
        .logoWordmark :global(span) {
          color: #D85A30;
        }
        .logoTagline {
          font-size: 0.6rem;
          font-weight: 600;
          letter-spacing: 0.14em;
          color: #8a8883;
          margin-top: 0.1rem;
        }
        .badge {
          display: inline-block;
          background: var(--tan-light);
          color: var(--leather);
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 0.3rem 0.75rem;
          border-radius: 999px;
          margin-bottom: 1.25rem;
        }
        h1 {
          font-family: 'Playfair Display', serif;
          font-weight: 900;
          font-size: clamp(2rem, 5vw, 2.8rem);
          margin-bottom: 1.25rem;
        }
        .body-text {
          color: var(--tan);
          font-size: 1.05rem;
          line-height: 1.7;
          margin-bottom: 2rem;
        }
        .body-text strong {
          color: var(--cream);
        }
        .waitlist-form {
          display: flex;
          gap: 0.6rem;
          max-width: 420px;
          width: 100%;
          margin: 0 auto 0.75rem;
        }
        .waitlist-form input[type='email'] {
          flex: 1;
          padding: 0.75rem 0.9rem;
          border: 1px solid var(--rope);
          border-radius: 5px;
          font-size: 0.95rem;
          font-family: inherit;
          background: var(--tan-light);
          color: var(--ink);
        }
        .waitlist-form button {
          background: var(--rust);
          color: var(--cream);
          border: none;
          border-radius: 5px;
          padding: 0.75rem 1.25rem;
          font-size: 0.95rem;
          font-weight: 700;
          cursor: pointer;
          white-space: nowrap;
        }
        .waitlist-form button:hover:not(:disabled) {
          background: #8a6a25;
        }
        .waitlist-form button:disabled {
          opacity: 0.6;
          cursor: default;
        }
        /* Lightened tints, not the raw --green/--oxblood tokens - same
           legibility reasoning as the Wix version: those tokens are too
           dark to read against this page's --leather background. */
        .waitlist-note {
          font-size: 0.85rem;
          min-height: 1.3em;
          margin-bottom: 2rem;
        }
        .waitlist-note.success {
          color: #8fae7a;
          font-weight: 700;
        }
        .waitlist-note.error {
          color: #d98a94;
          font-weight: 700;
        }
        .links {
          font-size: 0.9rem;
        }
        .links a {
          color: var(--brass-light);
          text-decoration: none;
          font-weight: 700;
        }
        .links a:hover {
          text-decoration: underline;
        }
        @media (max-width: 480px) {
          .waitlist-form {
            flex-direction: column;
          }
        }
      `}</style>
    </>
  );
}
