/*
  Warnings:

  - A unique constraint covering the columns `[razorpayRefundId]` on the table `Order` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "razorpayRefundId" TEXT,
ADD COLUMN     "refundedAt" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "Order_razorpayRefundId_key" ON "Order"("razorpayRefundId");
