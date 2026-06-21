# API Operations

A representative recreation of a self-service API operations portal, built to support two case
studies on [christopherrangelux-dev.github.io/Portfolio](https://christopherrangelux-dev.github.io/Portfolio/):
**Self-Service Workflow** and **API Governance**.

- **Apps + Change Order** — the centerpiece: select an existing application, open the change-order
  side panel, pick a change type from the dropdown (owner, department, business purpose, technical
  contact, or deactivation), fill in the fields that appear, and submit. Tracks recent change orders
  in a table below — this is the "before/after" flow the Self-Service Workflow case study is about
  (a confusing multi-touch process collapsed into a single guided path), plus the original
  multi-step "Register Application" wizard.
- **Catalog** — browsable APIs with data-sensitivity classification and access policy.
- **Approvals** — pending access requests with risk scoring, scope diffs, and an approve/reject
  decision flow — the governance side of the story.
- **Settings** — account preferences.

No real company data or branding — mock content only, genericized for public use.

## Running locally

```bash
npm install
npm run dev
```

```bash
npm run build
```
