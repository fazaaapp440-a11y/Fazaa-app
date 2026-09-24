import { Router, type IRouter } from "express";
import { db, categoriesTable, providersTable } from "@workspace/db";
import { eq, count } from "drizzle-orm";
import { requireAuth, requireAdmin, type AuthRequest } from "../middlewares/auth";
import { CreateCategoryBody } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/categories", async (_req, res): Promise<void> => {
  const cats = await db.select().from(categoriesTable);
  const counts = await db
    .select({ categoryId: providersTable.categoryId, cnt: count(providersTable.id) })
    .from(providersTable)
    .groupBy(providersTable.categoryId);

  const countMap = new Map(counts.map((c) => [c.categoryId, Number(c.cnt)]));
  const result = cats.map((cat) => ({
    id: cat.id,
    name: cat.name,
    icon: cat.icon,
    providerCount: countMap.get(cat.id) ?? 0,
  }));
  res.json(result);
});

router.post("/categories", requireAuth, requireAdmin, async (req: AuthRequest, res): Promise<void> => {
  const parsed = CreateCategoryBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [cat] = await db.insert(categoriesTable).values(parsed.data).returning();
  res.status(201).json({ id: cat.id, name: cat.name, icon: cat.icon, providerCount: 0 });
});

export default router;
