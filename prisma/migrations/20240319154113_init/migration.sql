/*
  Warnings:

  - Added the required column `fileName` to the `Codes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Codes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `codes` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `fileName` VARCHAR(191) NOT NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;
