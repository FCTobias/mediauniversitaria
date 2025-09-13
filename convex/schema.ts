// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  courses: defineTable({
    userId: v.string(),
    name: v.string(),
    cfu: v.number(),
    grade: v.optional(v.union(v.number(), v.literal("lode"))),
    passed: v.boolean(),
  }).index("by_userId", ["userId"]),
});