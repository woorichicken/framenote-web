import { defineConfig } from "drizzle-kit";

export default defineConfig({
  // 스키마 파일 위치
  schema: "./lib/db/schema.ts",
  // 마이그레이션 파일 저장 위치
  out: "./drizzle",
  // PostgreSQL 드라이버 사용 (Neon)
  dialect: "postgresql",
  // DB 연결 정보
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  // Neon provider 설정 (Neon 전용 역할 자동 제외)
  entities: {
    roles: {
      provider: "neon",
    },
  },
});
