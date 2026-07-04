# @bounded-systems/concierge-wire

The **pinned agreement** between `concierged` (the capability-broker door daemon
in [`door-concierge`](https://github.com/bounded-systems/door-concierge)) and its
in-box client (in [`door-kit`](https://github.com/bounded-systems/door-kit)) — a
**contract-only repo**. concierged mints attenuated DoorGrants a caller then
invokes peer-to-peer.

Both door-concierge (implements) and door-kit (calls) depend on **this**, not on
each other — breaking the `door-concierge ↔ door-kit` cycle + one-agreement-per-
pair violation the [trellis](https://github.com/bounded-systems/trellis) lattice
check flags.

- **`mod.ts`** — the agreement, as [`@bounded-systems/verbspec`](https://github.com/bounded-systems/verbspec)
  verbs: concierged's 5 methods (`register`, `resolve`, `keys`, `list`,
  `status`).
- **`manifest.json`** — the dependency-free projection (`deno task gen`) trellis
  reads for its offline conformance check.

Source-available under **PolyForm Noncommercial 1.0.0**.
