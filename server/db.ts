import { eq, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, archiveItems, InsertArchiveItem, ArchiveItem } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Archive Items CRUD
export async function getArchiveItems(): Promise<ArchiveItem[]> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get archive items: database not available");
    return [];
  }

  const items = await db.select().from(archiveItems).orderBy(desc(archiveItems.createdAt));
  return items;
}

export async function createArchiveItem(item: InsertArchiveItem): Promise<ArchiveItem> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const result = await db.insert(archiveItems).values(item);
  // MySQL doesn't return inserted rows like PostgreSQL, so we fetch the newly created item
  const created = await db.select().from(archiveItems).orderBy(desc(archiveItems.createdAt)).limit(1);
  return created[0];
}

export async function updateArchiveItem(id: number, item: Partial<InsertArchiveItem>): Promise<ArchiveItem | null> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  await db.update(archiveItems).set(item).where(eq(archiveItems.id, id));
  const updated = await db.select().from(archiveItems).where(eq(archiveItems.id, id)).limit(1);
  return updated.length > 0 ? updated[0] : null;
}

export async function deleteArchiveItem(id: number): Promise<boolean> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  await db.delete(archiveItems).where(eq(archiveItems.id, id));
  return true;
}

// TODO: add feature queries here as your schema grows.
