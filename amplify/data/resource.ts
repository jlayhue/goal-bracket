// amplify/data/resource.ts
import { a, defineData, type ClientSchema } from '@aws-amplify/backend';

// Define the embedded type (Matchup)
const Matchup = a.customType({
  id: a.id(),
  round: a.integer(),
  goalA: a.string(),
  goalB: a.string(),
  selected: a.string(), // optional by default
});

const schema = a.schema({
  GoalBracket: a.model({
    title: a.string().required(),
    category: a.enum(['CAREER', 'FAITH', 'FAMILY', 'FITNESS', 'FINANCIAL', 'PERSONAL', 'OTHER']),
    goals: a.string().array().required(),
    matchups: a.ref('Matchup').array(), // 👈 this is the correct syntax
    winner: a.string(),
    round: a.integer(),
  }).authorization(allow => [allow.owner()]),

  // Register the custom type
  Matchup,
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
});
