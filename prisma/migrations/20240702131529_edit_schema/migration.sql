/*
  Warnings:

  - You are about to drop the column `isVerified` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `verifications` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `followedId` on table `follows` required. This step will fail if there are existing NULL values in that column.
  - Made the column `followerId` on table `follows` required. This step will fail if there are existing NULL values in that column.
  - Made the column `userId` on table `likes` required. This step will fail if there are existing NULL values in that column.
  - Made the column `threadId` on table `likes` required. This step will fail if there are existing NULL values in that column.
  - Made the column `userId` on table `replies` required. This step will fail if there are existing NULL values in that column.
  - Made the column `threadId` on table `replies` required. This step will fail if there are existing NULL values in that column.
  - Made the column `userId` on table `threads` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "follows" DROP CONSTRAINT "follows_followedId_fkey";

-- DropForeignKey
ALTER TABLE "follows" DROP CONSTRAINT "follows_followerId_fkey";

-- DropForeignKey
ALTER TABLE "likes" DROP CONSTRAINT "likes_threadId_fkey";

-- DropForeignKey
ALTER TABLE "likes" DROP CONSTRAINT "likes_userId_fkey";

-- DropForeignKey
ALTER TABLE "replies" DROP CONSTRAINT "replies_threadId_fkey";

-- DropForeignKey
ALTER TABLE "replies" DROP CONSTRAINT "replies_userId_fkey";

-- DropForeignKey
ALTER TABLE "threads" DROP CONSTRAINT "threads_userId_fkey";

-- AlterTable
ALTER TABLE "follows" ALTER COLUMN "followedId" SET NOT NULL,
ALTER COLUMN "followerId" SET NOT NULL;

-- AlterTable
ALTER TABLE "likes" ALTER COLUMN "userId" SET NOT NULL,
ALTER COLUMN "threadId" SET NOT NULL;

-- AlterTable
ALTER TABLE "replies" ALTER COLUMN "userId" SET NOT NULL,
ALTER COLUMN "threadId" SET NOT NULL;

-- AlterTable
ALTER TABLE "threads" ALTER COLUMN "userId" SET NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "isVerified";

-- DropTable
DROP TABLE "verifications";

-- DropEnum
DROP TYPE "VerificationType";

-- AddForeignKey
ALTER TABLE "replies" ADD CONSTRAINT "replies_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "replies" ADD CONSTRAINT "replies_threadId_fkey" FOREIGN KEY ("threadId") REFERENCES "threads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "threads" ADD CONSTRAINT "threads_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "likes" ADD CONSTRAINT "likes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "likes" ADD CONSTRAINT "likes_threadId_fkey" FOREIGN KEY ("threadId") REFERENCES "threads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "follows" ADD CONSTRAINT "follows_followedId_fkey" FOREIGN KEY ("followedId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "follows" ADD CONSTRAINT "follows_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
