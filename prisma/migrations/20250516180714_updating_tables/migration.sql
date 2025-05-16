-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Product" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT,
    "description" TEXT,
    "price" REAL NOT NULL,
    "discount" REAL DEFAULT 0,
    "stock" INTEGER NOT NULL DEFAULT 10,
    "sku" TEXT,
    "imageUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "isAvaiable" BOOLEAN NOT NULL DEFAULT true,
    "rating" INTEGER NOT NULL DEFAULT 1,
    "categoryId" TEXT,
    "brand" TEXT,
    "color" TEXT,
    "weight" REAL,
    "dimensions" JSONB,
    CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Product" ("categoryId", "createdAt", "description", "id", "imageUrl", "isAvaiable", "name", "price", "rating", "updatedAt") SELECT "categoryId", "createdAt", "description", "id", "imageUrl", "isAvaiable", "name", "price", "rating", "updatedAt" FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
CREATE UNIQUE INDEX "Product_slug_key" ON "Product"("slug");
CREATE UNIQUE INDEX "Product_sku_key" ON "Product"("sku");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
