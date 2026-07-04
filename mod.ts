/**
 * @module
 * @bounded-systems/concierge-wire — the pinned agreement between concierged
 * (door-concierge) and its in-box client (door-kit). concierged mints attenuated
 * DoorGrants a caller then invokes peer-to-peer. Authored once as VerbSpec verbs;
 * both sides depend on THIS, not each other. Regenerate manifest.json with
 * `deno task gen`.
 *
 * NB: door-kit's concierge client dispatches with `call(socket, "<method>", …)`
 * (the method is the 2nd arg), unlike keeper/scout's `request("<method>", …)`.
 */

import { z } from "zod";
import { defineVerb, type VerbSpec } from "verbspec";

const IssuerKey = z.object({ kid: z.string(), publicKeyPem: z.string() });
const SignedGrant = z.object({
  guest: z.string(), // the attenuated transport the caller then invokes
  caveats: z.array(z.string()).optional(),
  expiresAt: z.number().optional(),
});

const RegisterInput = z.object({
  capability: z.string(),
  door: z.string(),
  env: z.string().optional(),
  grants: z.array(z.string()).optional(),
  caveats: z.array(z.string()).optional(),
  lease: z.number().optional(),
});
const RegisterOutput = z.object({ ttl: z.number() });
const register: VerbSpec<typeof RegisterInput, typeof RegisterOutput> =
  defineVerb({
    id: "register",
    summary: "Register a capability→door binding; returns its lease ttl.",
    actor: "concierge",
    input: RegisterInput,
    output: RegisterOutput,
    run: () => ({ ttl: 0 }),
  });

const ResolveInput = z.object({
  capability: z.string(),
  want: z.string(),
  audience: z.string().optional(),
});
const ResolveOutput = z.object({ door: SignedGrant });
const resolve: VerbSpec<typeof ResolveInput, typeof ResolveOutput> = defineVerb(
  {
    id: "resolve",
    summary:
      "Mint an attenuated DoorGrant for a capability the caller invokes.",
    actor: "concierge",
    input: ResolveInput,
    output: ResolveOutput,
    run: () => ({ door: { guest: "" } }),
  },
);

const KeysInput = z.object({});
const KeysOutput = z.object({ keys: z.array(IssuerKey) });
const keys: VerbSpec<typeof KeysInput, typeof KeysOutput> = defineVerb({
  id: "keys",
  summary: "The issuer's public keys for verifying minted grants.",
  actor: "concierge",
  input: KeysInput,
  output: KeysOutput,
  run: () => ({ keys: [] }),
});

const ListInput = z.object({});
const ListOutput = z.object({
  capabilities: z.array(
    z.object({ capability: z.string(), door: z.string() }),
  ),
});
const list: VerbSpec<typeof ListInput, typeof ListOutput> = defineVerb({
  id: "list",
  summary: "List registered capability→door bindings.",
  actor: "concierge",
  input: ListInput,
  output: ListOutput,
  run: () => ({ capabilities: [] }),
});

const StatusInput = z.object({});
const StatusOutput = z.object({ ok: z.boolean() });
const status: VerbSpec<typeof StatusInput, typeof StatusOutput> = defineVerb({
  id: "status",
  summary: "Daemon health.",
  actor: "concierge",
  input: StatusInput,
  output: StatusOutput,
  run: () => ({ ok: true }),
});

/** The concierge-wire method surface — the agreement both sides check against. */
export const CONCIERGE_WIRE: Record<string, VerbSpec> = {
  register,
  resolve,
  keys,
  list,
  status,
};
