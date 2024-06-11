/*
  Warnings:

  - A unique constraint covering the columns `[url]` on the table `Tenant` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Tenant_url_key" ON "Tenant"("url");
