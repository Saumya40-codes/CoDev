/*
  Warnings:

  - You are about to drop the column `createdAt` on the `codes` table. All the data in the column will be lost.
  - You are about to drop the column `fileName` on the `codes` table. All the data in the column will be lost.
  - You are about to drop the column `projectId` on the `codes` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `codes` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[fileId]` on the table `Codes` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `fileId` to the `Codes` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `codes` DROP FOREIGN KEY `Codes_projectId_fkey`;

-- AlterTable
ALTER TABLE `codes` DROP COLUMN `createdAt`,
    DROP COLUMN `fileName`,
    DROP COLUMN `projectId`,
    DROP COLUMN `updatedAt`,
    ADD COLUMN `fileId` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `Files` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `projectId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Codes_fileId_key` ON `Codes`(`fileId`);

-- AddForeignKey
ALTER TABLE `Files` ADD CONSTRAINT `Files_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `Projects`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Codes` ADD CONSTRAINT `Codes_fileId_fkey` FOREIGN KEY (`fileId`) REFERENCES `Files`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
