# Repository research: `jasperfrontend/overlabels`

**Repository:** [github.com/jasperfrontend/overlabels](https://github.com/jasperfrontend/overlabels)  
**ID:** `overlabels`

## Purpose

Overlabels is a Twitch overlay and alert platform/engine. It provides a web application for authoring HTML/CSS overlays, binding them to live Twitch data through a template-tag language, and managing controls and event-driven behavior. The source describes both a hand-authored template workflow and an unfinished drag-and-drop Builder. It also includes stream-event integrations, a Twitch chat bot, lists, maps/check-ins, and reusable recipe/product installations. This is therefore a full application rather than a standalone overlay renderer. [1] [2]

The repository’s advertised runtime restrictions matter to integration: template content is sanitized to remove script-like tags, and the README says external scripts are not permitted inside templates. Custom HTML/CSS, remote stylesheets and CSS resources are supported. [1] [3]

## Stack and architecture

- **Server:** PHP 8.4+ and Laravel 13, with Laravel routing, controllers, middleware, Eloquent models, migrations, jobs and service classes. Composer manifests also declare Inertia Laravel, Sanctum, Socialite, Reverb, Flysystem S3, image processing, and JSON Schema validation. [4] [5]
- **Web UI:** Vue 3 with TypeScript, Inertia.js, Pinia, Vite and Tailwind CSS v4. The main app entry mounts Inertia page components resolved from `resources/js/pages`, applies Ziggy route helpers, and initializes a Reverb/Pusher-compatible Echo client. Vite defines separate build entries for the main UI, welcome page, overlay, map, events feed and help experience. [6] [7]
- **Persistence and async services:** PostgreSQL is the test/production-oriented database in repository configuration and CI; Laravel queues, cache, and broadcasting are configurable. Reverb is the self-hosted WebSocket server. Many features are represented in migrations and grouped Laravel services. [5] [8]
- **Sidecars:** `expression-engine.mjs` is a Node HTTP service that imports the frontend expression evaluator to keep expression semantics shared. A separate `streamlabs-listener.mjs` process and Dockerfile are present for Streamlabs event listening. [9] [10]
- **Deployment:** Dockerfiles and a GitHub Actions workflow build the main application and both sidecar images, then deploy via Kamal. This is evidence of the project’s deployment arrangement, not a guarantee of an easy generic self-hosting setup. [10] [11]

At a high level, Laravel routes/controllers authenticate users and overlay tokens, validate and persist templates and controls, and assemble render payloads. Vue/TypeScript drives the dashboard and browser-source overlay. WebSocket events deliver changes to live overlays. External providers and Twitch are handled through dedicated services, integrations, webhooks and background jobs. The exact boundary is visible in the API routes: token-authenticated render and broadcasting endpoints coexist with stateful authenticated dashboard/API routes. [5] [6] [12]

## Concrete features evidenced in code

- Overlay templates and access-token management, including token-protected rendering and per-overlay access controls. The API includes render and overlay broadcasting-auth endpoints, and the controller contains authenticated render, persistence and import paths. [3] [12]
- A bracket-based template DSL for live Twitch data, formatting, conditions and expressions. The repo contains DSL documentation/data, a JavaScript expression engine, and PHP/TypeScript tests for DSL, tags and template rendering. [1] [9] [13]
- Twitch EventSub event delivery and alert wiring, including webhook/setup flows and real-time notifications. The route/controller/service and feature-test names cover EventSub setup, revocation, delivery, replay, alert targeting and stream sessions. [5] [12] [14]
- External donation/event services: Ko-fi, Streamlabs, Fourthwall, Buy Me a Coffee and Throne are represented by integration-specific services/controllers and tests; repository docs describe common control conventions. [1] [15]
- A Twitch chat bot with commands, aliases, counters, lists, check-ins and tower/game features, represented by internal API controllers, bot services, migrations and feature tests. [5] [16]
- Lists as user-managed data, including appenders, expiry, snapshots, event feeds and a token-authorized JSON read endpoint designed for browser consumers. [12] [17]
- Recipes/products and kits: recipe manifests, validation, installation, triggers, seeded recipes, product pages, and reusable kit sharing/import. [5] [18]
- Additional application surfaces include a map/check-in system, event feed dashboard, alert TTS/sounds, image upload, help/reference pages and admin tooling. These are supported by dedicated routes/services/tests rather than being inferred solely from promotional text. [5] [12] [19]

## Entry points, dependencies and configuration

**Primary entry points:** `public/index.php` enters Laravel; `artisan` is the CLI entry. `bootstrap/app.php` configures route files, middleware aliases and exception handling. `routes/web.php`, `routes/api.php`, `routes/auth.php`, `routes/settings.php`, `routes/admin.php` and `routes/channels.php` define the HTTP, auth, admin and broadcast surfaces. The main Vue entry is `resources/js/app.ts`; distinct browser entries include `resources/js/overlay/app.js`. Sidecar entry points are the two root-level `.mjs` files. [6] [7] [9] [10] [20]

**Important runtime dependencies:** PHP `^8.4.1`, Laravel `^13.0`, Inertia Laravel `^3.0`, Reverb `^1.5`, Sanctum `^4.0`, Socialite and Twitch Socialite provider, PDO, and an SQL database. Frontend runtime/build requires Node `>=22 <23`, Vue 3, Inertia Vue 3, Vite 8, TypeScript 6 and the listed UI/editor/map/graphics libraries. The checked-in Composer and npm lockfiles should be treated as the actual dependency resolutions. [4] [6]

**Configuration:** `.env.example` documents application/database/session/queue/cache settings; Reverb credentials and host/port; Twitch client and bot credentials; Streamlabs and Fourthwall credentials; object storage and image storage settings; backup destinations; and optional integration/webhook secrets. Public EventSub webhooks require a publicly reachable application URL according to repository setup notes. The expression sidecar requires `EXPRESSION_ENGINE_SECRET`; its evaluate endpoint checks an `X-Internal-Secret` header. [1] [9] [21]

## Tests and quality checks

The repository contains **192 Laravel/Pest feature-test files** and **29 unit-test files** in the inspected checkout. `phpunit.xml` configures Unit and Feature suites, with Pest bootstrapping and PostgreSQL settings. Frontend Vitest tests are scoped to pure TypeScript under `resources/js/**/*.test.ts`; the config explicitly excludes Vue component testing and uses Node rather than a DOM. CI provisions PostgreSQL 16 and runs frontend typecheck, Vitest, build, migrations and Pest. A separate workflow runs PHP Pint in test mode, Prettier check and ESLint check. [8] [22] [23]

This is substantial test coverage by file count, but counts do not establish coverage percentage or that every deployment/integration scenario is exercised. Tests are not claimed to have been run for this note.

## License and reuse

The root `LICENSE` file is present and identifies the **GNU Affero General Public License, version 3 or later (AGPL-3.0-or-later)**. Both Composer and npm manifests use the same SPDX expression. Reuse, modification and network deployment should be assessed under the AGPL’s terms; this note is not legal advice. [4] [24]

## Integration value, opportunities and risks

The clearest integration opportunities are the token-authenticated overlay render/broadcast APIs, the read-only JSON list endpoint, the shared triple-bracket/tag and expression semantics, and the recipe manifest/schema and installer model. These make the project relevant where a system needs Twitch-connected browser overlays, stream alerts, live controls, reusable overlay/product recipes, or externally consumable live lists. The API’s explicit stateless token handling and CORS rationale provide a concrete starting point for browser-source or custom-widget integration. [12] [13] [17] [18]

Main risks and constraints:

- **License compatibility:** AGPL-3.0-or-later is a material constraint for redistribution or offering a modified version as a network service; confirm compatibility with the consuming project’s licensing and distribution model. [24]
- **Operational footprint:** this is a full Laravel/PostgreSQL/queue/cache/WebSocket system with Twitch OAuth/EventSub and optional provider credentials, plus separate Node sidecars. It is not a drop-in static overlay widget. [4] [9] [10] [21]
- **External credentials and public callbacks:** Twitch EventSub requires a reachable callback URL; secrets and provider-specific configuration must be managed safely. [1] [21]
- **Untrusted overlay authoring:** the project deliberately strips scripts/embedded content from template material, so integrations expecting arbitrary JavaScript execution inside templates will not fit the documented rendering model. Preserve the sanitizer boundary when extending rendering. [1] [3]
- **Integration drift and service coupling:** overlays depend on project-defined tag/control conventions, access-token behavior, Reverb channel authorization and provider event normalization. Consumers should integrate through documented routes/contracts rather than relying on internal database tables or duplicating DSL behavior. This risk follows from the explicit route and service boundaries in the source. [9] [12] [13] [15]
- **Self-hosting support:** README explicitly says self-hosting support is not provided and labels its setup instructions for development/testing. Production use requires independent operational validation. [1]
- **License scope of assets/dependencies:** the root license establishes the project’s declared license, but does not by itself establish the licensing of every bundled font, image or third-party dependency; review those separately before redistribution. [4] [24]

## References

[1]: https://github.com/jasperfrontend/overlabels/blob/main/README.md "Overlabels README"
[2]: https://github.com/jasperfrontend/overlabels/tree/main/app "Application source tree"
[3]: https://github.com/jasperfrontend/overlabels/blob/main/app/Services/HtmlSanitizationService.php "Template HTML sanitization service"
[4]: https://github.com/jasperfrontend/overlabels/blob/main/composer.json "Composer manifest"
[5]: https://github.com/jasperfrontend/overlabels/tree/main/app/Services "Laravel services"
[6]: https://github.com/jasperfrontend/overlabels/blob/main/package.json "Node package manifest"
[7]: https://github.com/jasperfrontend/overlabels/blob/main/resources/js/app.ts "Vue and Inertia application entry"
[8]: https://github.com/jasperfrontend/overlabels/blob/main/phpunit.xml "PHPUnit and Pest configuration"
[9]: https://github.com/jasperfrontend/overlabels/blob/main/expression-engine.mjs "Expression engine sidecar"
[10]: https://github.com/jasperfrontend/overlabels/tree/main "Repository root including sidecar and Docker entrypoints"
[11]: https://github.com/jasperfrontend/overlabels/blob/main/.github/workflows/deploy.yml "Deployment workflow"
[12]: https://github.com/jasperfrontend/overlabels/blob/main/routes/api.php "API routes"
[13]: https://github.com/jasperfrontend/overlabels/tree/main/resources/js/lib "Frontend DSL and expression implementation"
[14]: https://github.com/jasperfrontend/overlabels/tree/main/tests/Feature "Feature tests"
[15]: https://github.com/jasperfrontend/overlabels/tree/main/app/Services/External "External integration services"
[16]: https://github.com/jasperfrontend/overlabels/tree/main/app/Http/Controllers/Api/Internal "Internal bot API controllers"
[17]: https://github.com/jasperfrontend/overlabels/blob/main/app/Http/Controllers/Api/ListReadController.php "Token-protected list read endpoint"
[18]: https://github.com/jasperfrontend/overlabels/tree/main/app/Services/Recipes "Recipe services"
[19]: https://github.com/jasperfrontend/overlabels/tree/main/app/Http/Controllers "HTTP controllers"
[20]: https://github.com/jasperfrontend/overlabels/blob/main/bootstrap/app.php "Laravel application bootstrap"
[21]: https://github.com/jasperfrontend/overlabels/blob/main/.env.example "Environment configuration template"
[22]: https://github.com/jasperfrontend/overlabels/blob/main/vitest.config.mts "Vitest configuration"
[23]: https://github.com/jasperfrontend/overlabels/blob/main/.github/workflows/tests.yml "CI test workflow"
[24]: https://github.com/jasperfrontend/overlabels/blob/main/LICENSE "GNU Affero General Public License text"
