import { api } from "encore.dev/api";
import { passportDB } from "./db";
import { ListPassportsRequest, ListPassportsResponse } from "./types";
import { transformPassportRow } from "./utils";

// Retrieves all passports with optional filtering, searching, and sorting.
export const list = api<ListPassportsRequest, ListPassportsResponse>(
  { expose: true, method: "GET", path: "/passports" },
  async (req) => {
    const limit = req.limit || 50;
    const offset = req.offset || 0;
    const sortBy = req.sortBy || "name";
    const sortOrder = req.sortOrder || "asc";

    let whereClause = "";
    let orderClause = "";
    const params: any[] = [];

    // Build WHERE clause for filtering and searching
    const conditions: string[] = [];
    
    if (req.status) {
      conditions.push(`status = $${params.length + 1}`);
      params.push(req.status);
    }

    if (req.search) {
      const searchParam = `%${req.search}%`;
      conditions.push(`(name ILIKE $${params.length + 1} OR passport_number ILIKE $${params.length + 2})`);
      params.push(searchParam, searchParam);
    }

    if (conditions.length > 0) {
      whereClause = `WHERE ${conditions.join(" AND ")}`;
    }

    // Build ORDER clause
    switch (sortBy) {
      case "name":
        orderClause = `ORDER BY name ${sortOrder.toUpperCase()}`;
        break;
      case "date":
        orderClause = `ORDER BY created_at ${sortOrder.toUpperCase()}`;
        break;
      case "status":
        orderClause = `ORDER BY status ${sortOrder.toUpperCase()}`;
        break;
      default:
        orderClause = "ORDER BY name ASC";
    }

    // Get total count
    const countQuery = `SELECT COUNT(*) as count FROM passports ${whereClause}`;
    const countRow = await passportDB.rawQueryRow(countQuery, ...params);
    const total = countRow?.count || 0;

    // Get paginated results
    const dataQuery = `
      SELECT * FROM passports 
      ${whereClause} 
      ${orderClause} 
      LIMIT $${params.length + 1} OFFSET $${params.length + 2}
    `;
    params.push(limit, offset);

    const rows = await passportDB.rawQueryAll(dataQuery, ...params);
    const passports = rows.map(transformPassportRow);

    return {
      passports,
      total,
    };
  }
);
