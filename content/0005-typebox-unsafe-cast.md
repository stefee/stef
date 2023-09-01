# Using unsafe cast in TypeBox to convert strings to template string literals

1 September 2023

---

## tl;dr

You can use `Type.Unsafe` to change the output type of a schema such as to cast a formatted `string` to a template literal type in a validation schema:

```ts
type UUID = `${string}-${string}-${string}-${string}-${string}`;

const schema = {
  id: Type.Unsafe<UUID>(Type.String({ format: "uuid" })),
};
```

---

I wanted to share this explanation for anyone trying to figure out how to do this, because it took me a while to figure it out!

The scenario is I'm using TypeBox as a type provider for Fastify which is using Ajv schema under the hood for parsing and validation of request params. My route handler is expecting a UUID string parameter:

```ts
import { UUID } from "crypto";

fastify.get(
  "/entity/:id",
  {
    schema: {
      params: Type.Object({
        id: Type.String({ format: "uuid" }),
      }),
    },
  },
  async (request, reply) => {
    const id: UUID = request.params.id;
  }
);

```

The UUID type imported from the crypto module is a template string literal type:

```ts
type UUID = `${string}-${string}-${string}-${string}-${string}`;
```

The code example fails because `request.params.id` does not get cast to the type UUID despite being validated using `{ format: "uuid" }` in the schema.

We could do the following:

```ts
  async (request, reply) => {
    const id: UUID = request.params.id as UUID;
  }
```

However this doesn't work in every case such as if the type of `request.params` is a union for example:

```ts
fastify.get(
  "/:kind/:id",
  {
    schema: {
      params: Type.Union([
        Type.Object({
          kind: Type.Literal("a"),
          id: Type.String(),
        }),
        Type.Object({
          kind: Type.Literal("b"),
          id: Type.String({ format: "uuid" }),
        }),
      ])
    },
  },
  async (request, reply) => {
    handleParams(request.params);
  }
);

function handleParams(params: { kind: "a"; id: string } | { kind: "b"; id: UUID }) {
}
```

There is no longer a place to put the `as UUID` as we did before.

**The solution I found here is to use `Type.Unsafe` to do an unsafe cast of the type in the schema:**

```ts
id: Type.Unsafe<UUID>(Type.String({ format: "uuid" })),
```

Now the type of `request.params.id` will be `UUID` - or in the union case the type of params is `{ kind: "a"; id: string } | { kind: "b"; id: UUID }` as we would expect.
