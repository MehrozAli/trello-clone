-- OrgLimit.count used to skip boards created on the Pro plan and could drift
-- under concurrent creates. It now counts every board, so resync it once.
INSERT INTO "OrgLimit" ("id", "orgId", "count", "createdAt", "updatedAt")
SELECT gen_random_uuid()::text, "orgId", count(*), now(), now()
FROM "Board"
GROUP BY "orgId"
ON CONFLICT ("orgId") DO UPDATE SET "count" = EXCLUDED."count", "updatedAt" = now();

UPDATE "OrgLimit"
SET "count" = 0, "updatedAt" = now()
WHERE "orgId" NOT IN (SELECT DISTINCT "orgId" FROM "Board");
