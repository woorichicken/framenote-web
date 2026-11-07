import { neon, NeonQueryFunction } from "@neondatabase/serverless";
import { drizzle, NeonHttpDatabase } from "drizzle-orm/neon-http";
import * as schema from "./schema";

// 빌드 시점에 환경변수가 없을 수 있으므로 lazy 초기화
let _db: NeonHttpDatabase<typeof schema> | null = null;

function getDb(): NeonHttpDatabase<typeof schema> {
  if (!_db) {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      throw new Error("DATABASE_URL environment variable is not set");
    }
    const sql: NeonQueryFunction<false, false> = neon(databaseUrl);
    _db = drizzle(sql, { schema });
  }
  return _db;
}

// Proxy로 lazy 초기화 - 실제 사용 시점에만 DB 연결
export const db = new Proxy({} as NeonHttpDatabase<typeof schema>, {
  get(_, prop) {
    return getDb()[prop as keyof NeonHttpDatabase<typeof schema>];
  },
});

// 스키마도 함께 내보내기
export * from "./schema";
