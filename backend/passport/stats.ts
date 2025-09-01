import { api } from "encore.dev/api";
import { passportDB } from "./db";
import { PassportStatsResponse } from "./types";

// Retrieves passport statistics grouped by status.
export const stats = api<void, PassportStatsResponse>(
  { expose: true, method: "GET", path: "/passports/stats" },
  async () => {
    const rows = await passportDB.queryAll`
      SELECT 
        status,
        COUNT(*) as count
      FROM passports 
      GROUP BY status
    `;

    const stats = {
      not_applied: 0,
      pending: 0,
      valid: 0,
      rejected: 0,
      canceled: 0,
      flight_complete: 0,
    };

    let total = 0;

    for (const row of rows) {
      const count = parseInt(row.count);
      total += count;
      if (row.status in stats) {
        stats[row.status as keyof typeof stats] = count;
      }
    }

    return { stats, total };
  }
);
