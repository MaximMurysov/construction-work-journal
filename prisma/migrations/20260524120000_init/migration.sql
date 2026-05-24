-- CreateTable
CREATE TABLE "work_types" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "default_unit" TEXT NOT NULL,

    CONSTRAINT "work_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_entries" (
    "id" SERIAL NOT NULL,
    "performed_at" DATE NOT NULL,
    "work_type_id" INTEGER NOT NULL,
    "volume" DECIMAL(12,2) NOT NULL,
    "unit" TEXT NOT NULL,
    "executor_name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "work_entries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "work_types_name_key" ON "work_types"("name");

-- CreateIndex
CREATE INDEX "work_entries_performed_at_idx" ON "work_entries"("performed_at");

-- AddForeignKey
ALTER TABLE "work_entries" ADD CONSTRAINT "work_entries_work_type_id_fkey" FOREIGN KEY ("work_type_id") REFERENCES "work_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
