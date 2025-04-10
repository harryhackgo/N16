-- AlterTable
ALTER TABLE "User" ADD COLUMN     "activationLink" TEXT,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT false;
