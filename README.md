# Thobane Sithole · Portfolio

Angular 18 front-end served by a Spring Boot 3 (Java 21) API, shipped as one Docker image on Render.

```
portfolio/
├── backend/            Spring Boot API + serves the built Angular app
│   └── src/main/resources/portfolio.json   ← ALL site content lives here
├── frontend/           Angular 18 (standalone components, signals)
├── Dockerfile          Builds Angular → bundles into the jar → runs it
└── render.yaml         One-click Render Blueprint
```

## Before you deploy: make it yours

Edit `backend/src/main/resources/portfolio.json`:

- **profile**: your real email, GitHub and LinkedIn URLs. Add a `cvUrl` (e.g. a Google Drive link to your CV) to show a "Download CV" button.
- **projects**: the four entries are *examples*. Replace them with projects you actually built, and add `repoUrl` / `liveUrl` so recruiters can click through. Only list work you can talk about confidently in an interview.
- **testimonials**: empty by default, so the section is hidden. Add `{ "quote": "...", "name": "...", "role": "..." }` entries (e.g. from your tech lead or a Geeks4Learning facilitator) and it appears automatically.

No code changes needed for any of that.

## Run it locally

You need Java 21, Maven 3.9+ and Node 20+.

```bash
# Terminal 1: API on http://localhost:8080
cd backend
mvn spring-boot:run

# Terminal 2: Angular dev server on http://localhost:4200 (proxies /api to 8080)
cd frontend
npm install
npm start
```

Run the tests: `cd backend && mvn test`

Test the production image exactly as Render will:

```bash
docker build -t portfolio .
docker run -p 8080:8080 -e CONTACT_ADMIN_TOKEN=test portfolio
# open http://localhost:8080
```

## Push to GitHub

Create an empty repo on GitHub (no README), then from the `portfolio` folder:

```bash
git init
git add .
git commit -m "Portfolio: Angular + Spring Boot"
git branch -M main
git remote add origin https://github.com/<your-username>/portfolio.git
git push -u origin main
```

## Deploy on Render

1. Sign in at render.com with GitHub.
2. **New → Blueprint**, select your `portfolio` repo. Render reads `render.yaml`.
3. Click **Apply**. The first build takes around 5–8 minutes (Node + Maven + Docker).
4. Your site is live at `https://thobane-portfolio.onrender.com` (or similar).

Every `git push` to `main` redeploys automatically.

> **Free plan note:** the service sleeps after 15 minutes without traffic and takes about a minute to wake. Open the site yourself a minute before an interview or before sending the link.

## Reading contact messages

Messages are logged (Render dashboard → your service → **Logs**) and kept in memory. To fetch them:

```bash
curl -H "X-Admin-Token: <token>" https://<your-app>.onrender.com/api/contact/messages
```

Find the token under **Environment → CONTACT_ADMIN_TOKEN** in Render. Memory is cleared on every redeploy or sleep, so treat the logs as the record. A natural next step is saving messages to PostgreSQL (Render has a free Postgres) or emailing them with `spring-boot-starter-mail`.

## API

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/portfolio` | All page content from `portfolio.json` |
| POST | `/api/contact` | `{ name, email, message }` → 201, or 400 with `{ errors: { field: message } }` |
| GET | `/api/contact/messages` | Recent messages (needs `X-Admin-Token`) |
| GET | `/actuator/health` | Render health check |

## Talking points for interviews

- **Single deployable:** Angular builds to static files that Spring Boot serves from `resources/static`, so there's one service, one URL and no CORS in production. `SpaForwardingController` sends browser refreshes back to `index.html`.
- **Validation on both sides:** Angular's reactive form mirrors the Bean Validation rules on `ContactRequest`; `ApiExceptionHandler` turns server-side failures into field errors the form shows inline.
- **Testing:** `@WebMvcTest` + `@MockBean` for the controller slice, plain JUnit for services, `@SpringBootTest` for the full context.
- **Container:** multi-stage Docker build keeps the runtime image to a JRE plus one jar, running as a non-root user, with JVM memory tuned for a 512 MB container.
- **The event stream in the hero:** a front-end nod to event-driven architecture. Each visitor action (opening a project, sending a message) emits an event into an Angular signal-based store, like a producer publishing to a topic that UI components consume.
