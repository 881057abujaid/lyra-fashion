-- CreateTable
CREATE TABLE "HeroBanner" (
    "id" TEXT NOT NULL,
    "title" TEXT,
    "subtitle" TEXT,
    "desktopImageUrl" TEXT NOT NULL,
    "desktopImagePublicId" TEXT NOT NULL,
    "mobileImageUrl" TEXT,
    "mobileImagePublicId" TEXT,
    "imageAlt" TEXT NOT NULL,
    "ctaLabel" TEXT,
    "ctaHref" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "startAt" TIMESTAMP(3),
    "endAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HeroBanner_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "HeroBanner_isActive_sortOrder_idx" ON "HeroBanner"("isActive", "sortOrder");

-- CreateIndex
CREATE INDEX "HeroBanner_startAt_endAt_idx" ON "HeroBanner"("startAt", "endAt");
