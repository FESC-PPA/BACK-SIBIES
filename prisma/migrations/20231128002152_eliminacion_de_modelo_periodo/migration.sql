/*
  Warnings:

  - You are about to drop the column `periodId` on the `statushistory` table. All the data in the column will be lost.
  - You are about to drop the `period` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `period` to the `StatusHistory` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `statushistory` DROP FOREIGN KEY `StatusHistory_periodId_fkey`;

-- AlterTable
ALTER TABLE `statushistory` DROP COLUMN `periodId`,
    ADD COLUMN `period` DATETIME(3) NOT NULL;

-- DropTable
DROP TABLE `period`;
