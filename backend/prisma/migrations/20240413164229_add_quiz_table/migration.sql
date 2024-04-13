-- CreateTable
CREATE TABLE "Quiz" (
    "id" SERIAL NOT NULL,
    "roster_id" INTEGER NOT NULL,
    "score" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Quiz_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Quiz_roster_id_key" ON "Quiz"("roster_id");

-- AddForeignKey
ALTER TABLE "Quiz" ADD CONSTRAINT "Quiz_roster_id_fkey" FOREIGN KEY ("roster_id") REFERENCES "roster"("id") ON DELETE CASCADE ON UPDATE CASCADE;
