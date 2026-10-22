-- CreateEnum
CREATE TYPE "ReadingStatus" AS ENUM ('WANT_TO_READ', 'CURRENTLY_READING', 'FINISHED');

-- CreateTable
CREATE TABLE "ShelfBook" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "openLibraryId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "authors" TEXT[],
    "coverUrl" TEXT,
    "status" "ReadingStatus" NOT NULL DEFAULT 'WANT_TO_READ',
    "rating" INTEGER,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ShelfBook_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ShelfBook_userId_status_idx" ON "ShelfBook"("userId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "ShelfBook_userId_openLibraryId_key" ON "ShelfBook"("userId", "openLibraryId");

-- AddForeignKey
ALTER TABLE "ShelfBook" ADD CONSTRAINT "ShelfBook_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
