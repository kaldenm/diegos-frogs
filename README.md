# Diego's Frogs

Diego's Frogs is a small Next.js app that turns a short message into a simple generated frog drawing. The user writes what the frog should convey, the app asks OpenAI to create a minimal black-line frog image, then displays it with download, clipboard, and mobile share actions.

The project was built as a playful image-generation experiment inspired by Diego Rivera's frog drawings for Frida Kahlo. It is intentionally small: one input, one generated image, and a few ways to save or share the result.

## Stack

- Next.js 15 with the App Router
- React 19 release candidate
- Tailwind CSS
- OpenAI image generation API
- Next.js image proxy route for generated image downloads
- `next-pwa` service worker support

## Setup

Install dependencies:

```bash
npm install
```

Create a local environment file:

```bash
touch .env
```

Add the required environment variable:

```bash
OPENAI_API_KEY=your_openai_api_key
```

Run the development server:

```bash
npm run dev
```

Open `http://localhost:3000`.

Build for production:

```bash
npm run build
```

## Environment Variables

`OPENAI_API_KEY` is required by the image-generation route. Without it, the app returns a server configuration error instead of calling OpenAI.

Do not commit `.env` files or browser session directories. WhatsApp Web runtime artifacts such as `.wwebjs_auth/`, `.wwebjs_cache/`, and `sessions/` are ignored because they can contain local browser state.

## Code Tour

- `src/app/page.js` owns the main client flow: message input state, image generation request, localStorage persistence, download/copy, mobile share, reset, and user-facing error states.
- `src/app/components/CreateFrog.js` renders the message form and submit button.
- `src/app/components/FrogImage.js` renders the generated image through Next's image component.
- `src/app/components/DownloadButton.js` and `src/app/components/MobileShareButton.js` render the save/share actions.
- `src/app/api/generate-frog/route.js` validates server configuration, accepts the message, calls the frog generator, and returns the generated image URL.
- `lib/generateFrog.js` builds the frog drawing prompt and calls the OpenAI image API.
- `src/app/api/image-proxy/route.js` proxies generated image URLs so the browser can load and download them consistently.
- `public/sw.js` contains the service worker output used by the PWA setup.

## Current Status

The app is a portfolio-ready prototype. Core generation, display, download/copy, and mobile sharing flows are present. The repository intentionally excludes local environment files and runtime browser/session artifacts.
