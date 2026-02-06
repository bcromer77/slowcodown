-- CreateEnum
CREATE TYPE "Sense" AS ENUM ('TASTE', 'SMELL', 'TEXTURE', 'SIGHT', 'SOUND');

-- CreateEnum
CREATE TYPE "Season" AS ENUM ('SPRING', 'SUMMER', 'AUTUMN', 'WINTER', 'ALL_YEAR');

-- CreateEnum
CREATE TYPE "Mood" AS ENUM ('QUIET', 'WARMING', 'CELEBRATORY', 'CONTEMPLATIVE', 'COMFORTING');

-- CreateEnum
CREATE TYPE "BestEnjoyedWhen" AS ENUM ('EARLY_MORNING', 'LONG_LUNCH', 'LATE_EVENING', 'AFTER_A_WALK', 'WHEN_RAINING', 'CELEBRATORY', 'ALONE', 'WITH_FRIENDS');

-- CreateEnum
CREATE TYPE "ExperienceCategory" AS ENUM ('DRINKS', 'WALKS', 'SEA', 'HIDDEN', 'MAKERS', 'MARKETS', 'STAY');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Restaurant" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "coverImage" TEXT,
    "coverImagePublic" BOOLEAN NOT NULL DEFAULT true,
    "mood" "Mood" NOT NULL DEFAULT 'QUIET',
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Restaurant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DailyMenu" (
    "id" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "content" TEXT NOT NULL,
    "restaurantId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DailyMenu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Course" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" VARCHAR(300) NOT NULL,
    "photo" TEXT,
    "photoPublic" BOOLEAN NOT NULL DEFAULT true,
    "sense" "Sense" NOT NULL DEFAULT 'TASTE',
    "season" "Season" NOT NULL DEFAULT 'ALL_YEAR',
    "bestEnjoyedWhen" "BestEnjoyedWhen",
    "dateServed" DATE,
    "ingredients" TEXT[],
    "restaurantId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Experience" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "category" "ExperienceCategory" NOT NULL,
    "location" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "shortDesc" VARCHAR(200),
    "coverImage" TEXT,
    "mood" "Mood" NOT NULL DEFAULT 'QUIET',
    "season" "Season" NOT NULL DEFAULT 'ALL_YEAR',
    "duration" TEXT,
    "difficulty" TEXT,
    "bookingUrl" TEXT,
    "tags" TEXT[],
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Experience_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Collection" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "coverImage" TEXT,
    "isKevinsPick" BOOLEAN NOT NULL DEFAULT false,
    "mood" "Mood",
    "season" "Season",
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Collection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CollectionItem" (
    "id" TEXT NOT NULL,
    "collectionId" TEXT NOT NULL,
    "restaurantId" TEXT,
    "experienceId" TEXT,
    "note" VARCHAR(200),
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CollectionItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TextAlertSubscriber" (
    "id" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "name" TEXT,
    "locations" TEXT[],
    "interests" TEXT[],
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TextAlertSubscriber_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TextAlert" (
    "id" TEXT NOT NULL,
    "message" VARCHAR(160) NOT NULL,
    "sentBy" TEXT,
    "sentByName" TEXT,
    "location" TEXT,
    "recipientCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TextAlert_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Restaurant_slug_key" ON "Restaurant"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Restaurant_userId_key" ON "Restaurant"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "DailyMenu_restaurantId_date_key" ON "DailyMenu"("restaurantId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "Experience_slug_key" ON "Experience"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Collection_slug_key" ON "Collection"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "TextAlertSubscriber_phone_key" ON "TextAlertSubscriber"("phone");

-- AddForeignKey
ALTER TABLE "Restaurant" ADD CONSTRAINT "Restaurant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyMenu" ADD CONSTRAINT "DailyMenu_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollectionItem" ADD CONSTRAINT "CollectionItem_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection"("id") ON DELETE CASCADE ON UPDATE CASCADE;
