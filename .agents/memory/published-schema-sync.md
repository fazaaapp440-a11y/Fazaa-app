---
name: Published schema sync
description: Production behavior when a newly added database table is missing after a successful publish.
---

When a deployed route returns a database error for a table that exists in the Drizzle source, first sync the additive schema in development and then republish; a passing health endpoint does not prove feature tables are present in production.

**Why:** The API can start and report healthy while a later auth or feature query fails because the publish-time schema diff was not applied to the production database.

**How to apply:** Verify the failure from deployment logs, run the documented non-destructive development schema push, test the route locally, and ask the user to republish. Never add startup-time DDL or a deploy hook that mutates production.