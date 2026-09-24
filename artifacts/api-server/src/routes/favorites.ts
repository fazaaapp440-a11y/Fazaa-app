import { Router, type IRouter } from "express";
import { db, favoritesTable, providersTable, usersTable, categoriesTable } from "@workspace/db";
import { eq, and, desc } from "drizzle-orm";
import { requireAuth, type AuthRequest } from "../middlewares/auth";

const router: IRouter = Router();

router.get("/favorites", requireAuth, async (req: AuthRequest, res): Promise<void> => {
  const favs = await db
    .select({ f: favoritesTable, p: providersTable, u: usersTable, c: categoriesTable })
    .from(favoritesTable)
    .innerJoin(providersTable, eq(favoritesTable.providerId, providersTable.id))
    .innerJoin(usersTable, eq(providersTable.userId, usersTable.id))
    .innerJoin(categoriesTable, eq(providersTable.categoryId, categoriesTable.id))
    .where(eq(favoritesTable.userId, req.userId!));

  res.json(favs.map(({ p, u, c }) => ({
    id: p.id,
    name: u.name,
    avatarUrl: u.avatarUrl ?? null,
    categoryName: c.name,
    categoryIcon: c.icon,
    city: p.city,
    district: p.district,
    rating: parseFloat(p.rating ?? "0"),
    reviewCount: p.reviewCount,
    completedJobs: p.completedJobs,
    yearsExperience: p.yearsExperience,
    hourlyRate: p.hourlyRate ? parseFloat(p.hourlyRate) : null,
    isVerified: p.isVerified,
    isAvailable: p.isAvailable,
    distanceKm: null,
    lat: p.lat ? parseFloat(p.lat) : null,
    lng: p.lng ? parseFloat(p.lng) : null,
  })));
});

router.post("/favorites/:providerId", requireAuth, async (req: AuthRequest, res): Promise<void> => {
  const raw = Array.isArray(req.params.providerId) ? req.params.providerId[0] : req.params.providerId;
  const providerId = parseInt(raw, 10);
  if (isNaN(providerId)) { res.status(400).json({ error: "Invalid providerId" }); return; }

  const [existing] = await db
    .select()
    .from(favoritesTable)
    .where(and(eq(favoritesTable.userId, req.userId!), eq(favoritesTable.providerId, providerId)));

  if (!existing) {
    await db.insert(favoritesTable).values({ userId: req.userId!, providerId });
  }
  res.status(201).json({ success: true });
});

router.delete("/favorites/:providerId", requireAuth, async (req: AuthRequest, res): Promise<void> => {
  const raw = Array.isArray(req.params.providerId) ? req.params.providerId[0] : req.params.providerId;
  const providerId = parseInt(raw, 10);
  if (isNaN(providerId)) { res.status(400).json({ error: "Invalid providerId" }); return; }

  await db
    .delete(favoritesTable)
    .where(and(eq(favoritesTable.userId, req.userId!), eq(favoritesTable.providerId, providerId)));

  res.json({ success: true });
});

export default router;
