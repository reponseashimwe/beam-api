-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "takenSeats" INTEGER;

-- CreateTable
CREATE TABLE "UserBooking" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "eventId" INTEGER NOT NULL,
    "status" BOOLEAN,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserBooking_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UserBooking" ADD CONSTRAINT "UserBooking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBooking" ADD CONSTRAINT "UserBooking_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
