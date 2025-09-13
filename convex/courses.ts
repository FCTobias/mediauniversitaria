// convex/courses.ts
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { ConvexError } from "convex/values";

// Ottiene i corsi per l'utente loggato
export const getCourses = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];
    return await ctx.db
      .query("courses")
      .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
      .order("desc")
      .collect();
  },
});

// Aggiunge un nuovo corso vuoto
export const addCourse = mutation({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError("Utente non autenticato.");
    await ctx.db.insert("courses", {
      userId: identity.subject,
      name: "",
      cfu: 0,
      passed: false,
    });
  },
});

// Aggiorna un corso esistente
export const updateCourse = mutation({
  args: {
    courseId: v.id("courses"),
    name: v.optional(v.string()),
    cfu: v.optional(v.number()),
    grade: v.optional(v.union(v.number(), v.literal("lode"))),
    passed: v.optional(v.boolean()),
  },
  handler: async (ctx, { courseId, ...rest }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError("Utente non autenticato.");
    
    const existing = await ctx.db.get(courseId);
    if (existing?.userId !== identity.subject) {
      throw new ConvexError("Non autorizzato a modificare questo corso.");
    }
    await ctx.db.patch(courseId, rest);
  },
});

// Elimina un corso
export const deleteCourse = mutation({
  args: { courseId: v.id("courses") },
  handler: async (ctx, { courseId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError("Utente non autenticato.");
    
    const existing = await ctx.db.get(courseId);
    if (existing?.userId !== identity.subject) {
      throw new ConvexError("Non autorizzato a eliminare questo corso.");
    }
    await ctx.db.delete(courseId);
  },
});

// Aggiunge corsi da un file Excel
export const addCoursesFromExcel = mutation({
    args: {
        courses: v.array(v.object({
            name: v.string(),
            cfu: v.number(),
            grade: v.optional(v.union(v.number(), v.literal("lode"))),
        }))
    },
    handler: async (ctx, { courses }) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new ConvexError("Utente non autenticato.");
        for (const course of courses) {
            await ctx.db.insert("courses", {
                userId: identity.subject,
                name: course.name,
                cfu: course.cfu,
                grade: course.grade,
                passed: course.grade !== undefined,
            });
        }
    }
});