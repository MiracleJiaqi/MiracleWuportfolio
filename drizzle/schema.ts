import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// TODO: Add your tables here

export const archiveItems = mysqlTable("archive_items", {
  id: int("id").autoincrement().primaryKey(),
  type: varchar("type", { length: 16 }).notNull(), // 'image' | 'bilibili' | 'youtube'
  category: varchar("category", { length: 32 }).notNull(),
  title: varchar("title", { length: 128 }).notNull(),
  desc: text("desc"),
  date: varchar("date", { length: 16 }),
  src: text("src"),
  bvid: varchar("bvid", { length: 32 }),
  thumbnail: text("thumbnail"),
  videoUrl: text("videoUrl"),
  tags: text("tags"), // JSON array string
  aspect: varchar("aspect", { length: 16 }).default("landscape"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ArchiveItem = typeof archiveItems.$inferSelect;
export type InsertArchiveItem = typeof archiveItems.$inferInsert;