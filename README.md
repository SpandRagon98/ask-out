# Okay, So I Have a Question.

_A tiny Sunday plan._ A small interactive invitation from Spandan to Debalina.

Seven short, tap-through screens. Everything fits on one screen with no
scrolling, from a 320 px phone to a big laptop. The only swiping is sideways,
through the restaurant cards.

1. **Good morning, Madamji.** Tap through four little beats. A rising sun, a coffee cup to tap.
2. **Quick panic check.** A slider from "totally chill" to "full panic", a face that reacts, and a "breathe with me" button.
3. **Here's the thing.** A deck of six paper notes to swipe away.
4. **The question.** The "Nope 😂" button dodges twice and then behaves. Then: FOOD.
5. **Shortlisted three places.** Photo cards (real ambience photos, slideshow) for Perima's, Mirabelle and Bonne Femme, or her own idea.
6. **What time, Madamji?** A slider whose sky goes from sunset to night, 5:00 to 7:00 PM.
7. **Sounds like a plan :)** A ticket, plus a pre-written WhatsApp reply.

The theme running through it: Spandan is chill, Debalina panics. There's a
"😵‍💫 Panic" button in the top bar on every screen that answers with a calming line.

Built with React, TypeScript, Vite, Tailwind CSS, Motion for React and Lucide.
No backend, no database, no analytics, no API keys. Nothing she picks leaves her
browser unless she sends the WhatsApp message herself.

---

## Run it locally

Needs Node 18 or newer.

```bash
npm install
npm run dev
```

Open http://localhost:5173.

While developing you can jump to a screen with `?screen=`:
`morning`, `panic`, `intro`, `question`, `food`, `time`, `plan`, `declined`
(for example http://localhost:5173/?screen=food). This only works in dev mode.
The production build always starts at the beginning.

## Production build

```bash
npm run build     # type-checks, builds to dist/, writes dist/404.html
npm run preview   # serves dist/ at http://localhost:4173
```

Asset paths are relative (`base: './'` in `vite.config.ts`), so the same
`dist/` works at a domain root or under a sub-path like `/<repo-name>/`.

## Deploy

The app has no routes beyond `/`, but every host is still set up to fall back
to `index.html`.

**Vercel:** import the repo. `vercel.json` sets the build command, the `dist`
output and the SPA rewrite. Or run `npx vercel` in this folder.

**Netlify:** import the repo, or drag `dist/` onto app.netlify.com/drop.
`netlify.toml` sets the build, the redirect and Node 20.

**GitHub Pages:** push to a `main` branch, then in the repo go to
Settings → Pages → Source and pick "GitHub Actions". The workflow in
`.github/workflows/deploy.yml` builds and publishes. `dist/404.html` handles
unknown paths.

All three send `noindex` so the page stays out of search results. Only people
with the link will find it.

## Customising

| What | Where |
| --- | --- |
| All the copy | The screen components in `src/components/` |
| Restaurants (name, area, cuisine, tagline, description, button text) | `src/data/restaurants.ts` |
| Time slots and their one-liners | `TIME_SLOTS` in `src/data/restaurants.ts` |
| The WhatsApp reply wording | `buildReply()` in `src/lib/plan.ts` |
| Colours, fonts, shadows | `tailwind.config.js` |
| Per-screen sky colours | `SKIES` in `src/components/AnimatedBackground.tsx` |
| Panic-button lines | `CHILL_LINES` in `src/components/ProgressIndicator.tsx` |
| Easter-egg lines | Search for `say(` in `src/components/` |
| Browser title, link preview text | `index.html` |

Reveal timing: each `<Reveal delay={…}>` is in seconds. When she comes back to
a screen she has already seen, the delays shrink to about a tenth, so she
doesn't sit through the slow version twice.

## Restaurant photos

Each card shows three ambience photos from the restaurant's own public listing,
loaded straight from the listing sites' image servers:

| Restaurant | Source |
| --- | --- |
| Perima's | [Swiggy Dineout photos](https://www.swiggy.com/restaurants/kolkata/ballygunge/perima-s-1252130/dineout/photos) |
| Mirabelle | [District by Zomato](https://www.district.in/dining/kolkata/mirabelle-hindustan-park) |
| Bonne Femme | [District by Zomato](https://www.district.in/dining/kolkata/bonne-femme-hindustan-park) |

Each card credits its source. If a photo fails to load, the card skips to the
next one, and if all fail it shows a drawn illustration instead.

Because they're hotlinked, those sites could change or remove them. To host
your own copies instead, put files in `public/images/` (around 1200 px wide,
under 250 KB) and replace the URLs in `src/data/restaurants.ts` with paths like
`'images/mirabelle-1.jpg'`.

## WhatsApp sharing

The "Okay, I'll text you :)" button opens

```
https://wa.me/?text=<URL-encoded message>
```

There's no phone number in it, so WhatsApp asks her which chat to send it to.
That's the WhatsApp app on phones, and WhatsApp Web or Desktop on computers.
Nothing is sent automatically. She can edit the message before sending.

The message changes with what she picked:

| She picked | Message |
| --- | --- |
| Mirabelle + 6:00 PM | Okay Spandan 😂 / Mirabelle sounds good! / Sunday around 6 works for me. / Let's plan it :) |
| Perima's, no time | Okayyy, Perima's looks good 😂 / Let's figure out the timing for Sunday! |
| Her own place | Okay, I have a better idea 👀 / How about [place]? / Let's figure out the timing! |
| Nothing specific | Okay, I'm up for Sunday :) / Let's decide the place and timing on WhatsApp. |

"Preview" shows the message with a Copy button. It uses the Clipboard API
and falls back to `execCommand('copy')`. If both fail, it tells her to
long-press the preview.

## Accessibility notes

- Each screen moves keyboard and screen-reader focus to its heading.
- "Nope 😂" only dodges a **mouse pointer** or the **first two taps**. Keyboard
  and assistive-tech activation always declines straight away. After two dodges
  it goes back to its spot and stays put. "Maybe another day" is always a
  normal button.
- The carousel has labelled previous/next buttons and dots, and slides are
  announced as "1 of 3: Perima's" and so on. On desktop it becomes a plain grid.
- The time and panic sliders are native range inputs, so arrow keys work.
- Popups (her own idea, other time, preview) trap focus and close on Escape.
- `prefers-reduced-motion` turns off the ambient animation, the slides and the
  sparkles, and shows text without delays.
- No sound. Nothing autoplays.

## Project structure

```
src/
  App.tsx                      screen flow and state
  main.tsx                     fonts + mount
  styles/global.css            Tailwind layers, buttons, ambient keyframes
  data/restaurants.ts          shortlist, time slots, Maps links
  lib/plan.ts                  state types, summaries, WhatsApp message
  lib/hooks.ts                 focus-on-screen, tiny haptic tap
  components/
    AnimatedBackground.tsx     night sky that shifts per screen
    ProgressIndicator.tsx      back button, step dots, Panic button
    MorningGreeting.tsx        screen 1 (tap-through beats)
    PanicCheck.tsx             screen 2 (panic slider + breathing)
    Introduction.tsx           screen 3 (swipeable notes)
    DateInvitation.tsx         screen 4 (question + "FOOD.")
    PlayfulNoButton.tsx        the polite escape artist
    RestaurantSelection.tsx    screen 5 (photo carousel / grid + own idea)
    RestaurantCard.tsx         photo slideshow card
    Modal.tsx                  small glass dialog
    RestaurantArt.tsx          SVG food illustrations + photo fallback
    TimeSelection.tsx          screen 6 (sunset slider)
    FinalConfirmation.tsx      screen 7 (the ticket)
    WhatsAppShare.tsx          reply preview, share link, copy fallback
    Declined.tsx               "Achha, no worries :)"
    DecorativeIllustrations.tsx sun, coffee, nervous buddy, doodles
    Reveal.tsx, Toast.tsx, SparkleBurst.tsx
```
