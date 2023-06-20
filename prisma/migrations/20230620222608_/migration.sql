/*
  Warnings:

  - Added the required column `isAnswered` to the `flashcards` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "flashcard_responses" ADD COLUMN     "answered_at" TIMESTAMPTZ,
ADD COLUMN     "decksTableId" VARCHAR;

-- AlterTable
ALTER TABLE "flashcards" ADD COLUMN     "isAnswered" BOOLEAN NOT NULL;

-- CreateTable
CREATE TABLE "decks" (
    "isAnswered" BOOLEAN NOT NULL,
    "owner_id" VARCHAR NOT NULL,
    "collection_id" VARCHAR NOT NULL,
    "id" VARCHAR NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ,

    CONSTRAINT "decks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "deck_flashcards" (
    "isWinner" BOOLEAN,
    "owner_id" VARCHAR NOT NULL,
    "deck_id" VARCHAR NOT NULL,
    "flashcard_id" VARCHAR NOT NULL,
    "id" VARCHAR NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ,

    CONSTRAINT "deck_flashcards_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "decks_id_key" ON "decks"("id");

-- CreateIndex
CREATE UNIQUE INDEX "deck_flashcards_id_key" ON "deck_flashcards"("id");

-- AddForeignKey
ALTER TABLE "decks" ADD CONSTRAINT "decks_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "decks" ADD CONSTRAINT "decks_collection_id_fkey" FOREIGN KEY ("collection_id") REFERENCES "collections"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deck_flashcards" ADD CONSTRAINT "deck_flashcards_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deck_flashcards" ADD CONSTRAINT "deck_flashcards_deck_id_fkey" FOREIGN KEY ("deck_id") REFERENCES "decks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deck_flashcards" ADD CONSTRAINT "deck_flashcards_flashcard_id_fkey" FOREIGN KEY ("flashcard_id") REFERENCES "flashcards"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
