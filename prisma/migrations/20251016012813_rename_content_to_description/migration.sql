/*
  Warnings:

  - You are about to drop the column `authorId` on the `Article` table. All the data in the column will be lost.
  - You are about to drop the column `content` on the `Article` table. All the data in the column will be lost.
  - You are about to drop the column `authorId` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `content` on the `Comment` table. All the data in the column will be lost.
  - Added the required column `description` to the `Article` table without a default value. This is not possible if the table is not empty.
  - Added the required column `text` to the `Comment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Comment` table without a default value. This is not possible if the table is not empty.
  - Made the column `username` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."Article" DROP CONSTRAINT "Article_authorId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Comment" DROP CONSTRAINT "Comment_authorId_fkey";

-- AlterTable
ALTER TABLE "Article" DROP COLUMN "authorId",
DROP COLUMN "content",
ADD COLUMN     "description" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "authorId",
DROP COLUMN "content",
ADD COLUMN     "text" TEXT NOT NULL,
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "username" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
