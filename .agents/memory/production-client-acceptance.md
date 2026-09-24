---
name: Production client acceptance
description: Published health checks do not prove client flows are testable; production needs approved catalog and provider data first.
---

The published API can be healthy while production has no users, categories, or providers. Treat data readiness as a separate prerequisite for client acceptance testing.

**Why:** A successful deployment returned healthy API responses, but empty production tables made search, provider profiles, and service requests impossible to verify without inventing or mutating test data.

**How to apply:** Before claiming client-flow acceptance, check production counts and confirm approved seed data exists; do not create test records automatically.