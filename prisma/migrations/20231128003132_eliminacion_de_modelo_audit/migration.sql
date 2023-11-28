/*
  Warnings:

  - You are about to drop the `audit` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `audit` DROP FOREIGN KEY `Audit_typeId_fkey`;

-- DropForeignKey
ALTER TABLE `audit` DROP FOREIGN KEY `Audit_userId_fkey`;

-- DropTable
DROP TABLE `audit`;
