import { neon } from "@neondatabase/serverless";

export const getSql = () => {
  const databaseUrl = process.env.RSVP_DB_DATABASE_URL || process.env.DATABASE_URL;

  if (!databaseUrl) {
    const error = new Error("RSVP_DB_DATABASE_URL or DATABASE_URL is not configured");
    error.code = "DATABASE_URL_MISSING";
    throw error;
  }

  return neon(databaseUrl);
};

export const ensureSchema = async (sql) => {
  await sql`
    CREATE TABLE IF NOT EXISTS rsvps (
      id TEXT PRIMARY KEY,
      guest_name TEXT NOT NULL,
      phone TEXT NOT NULL,
      guest_count INTEGER NOT NULL CHECK (guest_count BETWEEN 1 AND 20),
      attending_reception BOOLEAN NOT NULL DEFAULT FALSE,
      attending_wedding BOOLEAN NOT NULL DEFAULT FALSE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
};

export const serializeRsvp = (row) => ({
  id: row.id,
  name: row.guest_name,
  phone: row.phone,
  guestCount: row.guest_count,
  events: {
    reception: row.attending_reception,
    wedding: row.attending_wedding,
  },
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

export const handleDatabaseError = (error, response) => {
  console.error(error);

  if (error.code === "DATABASE_URL_MISSING") {
    return response.status(500).json({
      error: "RSVP database is not configured in Vercel yet.",
      code: "DATABASE_URL_MISSING",
    });
  }

  return response.status(500).json({ error: "Something went wrong while reading RSVP data." });
};
