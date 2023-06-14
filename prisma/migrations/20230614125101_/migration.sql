-- CreateTable
CREATE TABLE "collection_categories" (
    "name" VARCHAR NOT NULL,
    "id" VARCHAR NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ,

    CONSTRAINT "collection_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "collections" (
    "name" VARCHAR NOT NULL,
    "categoryId" VARCHAR NOT NULL,
    "description" VARCHAR NOT NULL,
    "privacy_status" VARCHAR NOT NULL,
    "owner_id" VARCHAR NOT NULL,
    "id" VARCHAR NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ,

    CONSTRAINT "collections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "flashcards" (
    "front" VARCHAR NOT NULL,
    "owner_id" VARCHAR NOT NULL,
    "collection_id" VARCHAR NOT NULL,
    "id" VARCHAR NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ,

    CONSTRAINT "flashcards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "flashcard_responses" (
    "text" VARCHAR NOT NULL,
    "flashcard_id" VARCHAR NOT NULL,
    "is_correct" BOOLEAN NOT NULL,
    "id" VARCHAR NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ,

    CONSTRAINT "flashcard_responses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "collection_categories_name_key" ON "collection_categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "collection_categories_id_key" ON "collection_categories"("id");

-- CreateIndex
CREATE UNIQUE INDEX "collections_id_key" ON "collections"("id");

-- CreateIndex
CREATE UNIQUE INDEX "flashcards_id_key" ON "flashcards"("id");

-- CreateIndex
CREATE UNIQUE INDEX "flashcard_responses_id_key" ON "flashcard_responses"("id");

-- AddForeignKey
ALTER TABLE "collections" ADD CONSTRAINT "collections_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "collection_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "collections" ADD CONSTRAINT "collections_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flashcards" ADD CONSTRAINT "flashcards_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flashcards" ADD CONSTRAINT "flashcards_collection_id_fkey" FOREIGN KEY ("collection_id") REFERENCES "collections"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flashcard_responses" ADD CONSTRAINT "flashcard_responses_flashcard_id_fkey" FOREIGN KEY ("flashcard_id") REFERENCES "flashcards"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
