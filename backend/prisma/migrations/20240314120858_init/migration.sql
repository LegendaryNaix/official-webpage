-- CreateEnum
CREATE TYPE "Role" AS ENUM ('User', 'Manager', 'Admin');

-- CreateEnum
CREATE TYPE "AccountStatus" AS ENUM ('Verifying', 'Enable', 'Disable');

-- CreateEnum
CREATE TYPE "RosterStatus" AS ENUM ('Enable', 'Military', 'Absence', 'Alumni');

-- CreateEnum
CREATE TYPE "RosterType" AS ENUM ('Athlete', 'Staff', 'Coach', 'HeadCoach');

-- CreateEnum
CREATE TYPE "StorageType" AS ENUM ('Document', 'Image', 'Video');

-- CreateEnum
CREATE TYPE "BoardType" AS ENUM ('Public', 'Notice', 'Appeal', 'Gallery');

-- CreateEnum
CREATE TYPE "ScheduleType" AS ENUM ('IntegratedExercise', 'SeperatedExercise', 'Event', 'Game');

-- CreateEnum
CREATE TYPE "AttendanceResponse" AS ENUM ('Present', 'Absence', 'Tardy');

-- CreateEnum
CREATE TYPE "AttendanceLocation" AS ENUM ('Seoul', 'Suwon', 'Other');

-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "username" VARCHAR(32) NOT NULL,
    "password" VARCHAR(512) NOT NULL,
    "email" VARCHAR(64) NOT NULL,
    "role" "Role" NOT NULL,
    "nickname" VARCHAR(64) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_password_changed" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_login" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "AccountStatus" NOT NULL DEFAULT 'Verifying',
    "profile_image_url" TEXT,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roster" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "profile_image_url" TEXT,
    "name" VARCHAR(32) NOT NULL,
    "status" "RosterStatus" NOT NULL,
    "type" "RosterType" NOT NULL,
    "off_position" TEXT,
    "def_position" TEXT,
    "spl_position" TEXT,
    "register_year" INTEGER NOT NULL,
    "admission_year" INTEGER NOT NULL,
    "class" VARCHAR(32) NOT NULL,
    "student_id" VARCHAR(16) NOT NULL,
    "back_number" INTEGER,
    "target" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "roster_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attendance" (
    "id" SERIAL NOT NULL,
    "roster_id" INTEGER NOT NULL,
    "schedule_id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "response" "AttendanceResponse" NOT NULL,
    "reason" TEXT,
    "result" "AttendanceResponse",
    "location" "AttendanceLocation",

    CONSTRAINT "attendance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "schedule" (
    "id" SERIAL NOT NULL,
    "survey_group_id" INTEGER NOT NULL,
    "name" VARCHAR(64) NOT NULL,
    "started_at" TIMESTAMP(3) NOT NULL,
    "ended_at" TIMESTAMP(3) NOT NULL,
    "type" "ScheduleType" NOT NULL DEFAULT 'IntegratedExercise',
    "description" TEXT NOT NULL,

    CONSTRAINT "schedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "surveyGroup" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(64) NOT NULL,
    "started_at" TIMESTAMP(3) NOT NULL,
    "ended_at" TIMESTAMP(3) NOT NULL,
    "required" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "surveyGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "surveyTarget" (
    "roster_id" INTEGER NOT NULL,
    "survey_group_id" INTEGER NOT NULL,
    "submit" BOOLEAN NOT NULL DEFAULT false
);

-- CreateTable
CREATE TABLE "board" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(64) NOT NULL,
    "type" "BoardType" NOT NULL DEFAULT 'Public',

    CONSTRAINT "board_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "post" (
    "id" SERIAL NOT NULL,
    "board_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comment" (
    "id" SERIAL NOT NULL,
    "parent_id" INTEGER,
    "post_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "storage" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "uri" TEXT NOT NULL,
    "type" "StorageType" NOT NULL,

    CONSTRAINT "storage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "postAttachment" (
    "storage_id" INTEGER NOT NULL,
    "post_id" INTEGER NOT NULL,

    CONSTRAINT "postAttachment_pkey" PRIMARY KEY ("storage_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_username_key" ON "user"("username");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "roster_student_id_key" ON "roster"("student_id");

-- CreateIndex
CREATE UNIQUE INDEX "attendance_roster_id_schedule_id_key" ON "attendance"("roster_id", "schedule_id");

-- CreateIndex
CREATE UNIQUE INDEX "surveyTarget_roster_id_survey_group_id_key" ON "surveyTarget"("roster_id", "survey_group_id");

-- AddForeignKey
ALTER TABLE "roster" ADD CONSTRAINT "roster_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendance" ADD CONSTRAINT "attendance_schedule_id_fkey" FOREIGN KEY ("schedule_id") REFERENCES "schedule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendance" ADD CONSTRAINT "attendance_roster_id_fkey" FOREIGN KEY ("roster_id") REFERENCES "roster"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schedule" ADD CONSTRAINT "schedule_survey_group_id_fkey" FOREIGN KEY ("survey_group_id") REFERENCES "surveyGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "surveyTarget" ADD CONSTRAINT "surveyTarget_roster_id_fkey" FOREIGN KEY ("roster_id") REFERENCES "roster"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "surveyTarget" ADD CONSTRAINT "surveyTarget_survey_group_id_fkey" FOREIGN KEY ("survey_group_id") REFERENCES "surveyGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post" ADD CONSTRAINT "post_board_id_fkey" FOREIGN KEY ("board_id") REFERENCES "board"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post" ADD CONSTRAINT "post_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment" ADD CONSTRAINT "comment_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment" ADD CONSTRAINT "comment_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment" ADD CONSTRAINT "comment_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "storage" ADD CONSTRAINT "storage_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "postAttachment" ADD CONSTRAINT "postAttachment_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "postAttachment" ADD CONSTRAINT "postAttachment_storage_id_fkey" FOREIGN KEY ("storage_id") REFERENCES "storage"("id") ON DELETE CASCADE ON UPDATE CASCADE;
