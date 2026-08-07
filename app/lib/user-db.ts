import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

export interface User {
  id: number;
  name: string;
  email: string;
  passwordHash: string;
}

interface UserRow {
  id: number;
  name: string;
  email: string;
  password_hash: string;
}

function toUser(row: UserRow): User {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    passwordHash: row.password_hash,
  };
}

export async function getUserByEmail(email: string): Promise<User | undefined> {
  const rows = await sql`SELECT id, name, email, password_hash FROM users WHERE email = ${email} LIMIT 1`;
  return rows[0] ? toUser(rows[0] as UserRow) : undefined;
}

export async function createUser(input: {
  name: string;
  email: string;
  passwordHash: string;
}): Promise<User> {
  const rows = await sql`
    INSERT INTO users (name, email, password_hash)
    VALUES (${input.name}, ${input.email}, ${input.passwordHash})
    RETURNING id, name, email, password_hash
  `;
  return toUser(rows[0] as UserRow);
}
