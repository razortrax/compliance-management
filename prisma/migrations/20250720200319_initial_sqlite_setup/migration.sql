-- CreateTable
CREATE TABLE "Organization" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "complianceStatus" TEXT NOT NULL,
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "zip" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "dotNumber" TEXT,
    "insurance" TEXT,
    "safetyRating" TEXT,
    "subscriptionTier" TEXT,
    "billingCycle" TEXT,
    "maxSubCompanies" INTEGER,
    "contactPerson" TEXT,
    "contactPhone" TEXT,
    "contactEmail" TEXT,
    "website" TEXT,
    "fleetSize" INTEGER,
    "driverCount" INTEGER,
    "lastAuditDate" DATETIME,
    "nextAuditDate" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Person" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "dob" DATETIME,
    "ssn" TEXT,
    "status" TEXT NOT NULL,
    "lastLoginAt" DATETIME,
    "loginCount" INTEGER,
    "failedLoginAttempts" INTEGER,
    "twoFactorEnabled" BOOLEAN NOT NULL DEFAULT false
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "companyType" TEXT NOT NULL,
    "permissions" JSONB NOT NULL,
    "personId" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "locationId" TEXT,
    CONSTRAINT "User_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "User_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Organization" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Equipment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "make" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "vin" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Role" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "roleType" TEXT NOT NULL,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME,
    "personId" TEXT,
    "equipmentId" TEXT,
    "managingOrgId" TEXT,
    "managedOrgId" TEXT,
    CONSTRAINT "Role_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Role_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES "Equipment" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Role_managingOrgId_fkey" FOREIGN KEY ("managingOrgId") REFERENCES "Organization" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Role_managedOrgId_fkey" FOREIGN KEY ("managedOrgId") REFERENCES "Organization" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Issue" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "expiresOn" DATETIME,
    "roleId" TEXT NOT NULL,
    CONSTRAINT "Issue_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "License" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "issueId" TEXT NOT NULL,
    "licenseState" TEXT NOT NULL,
    "licenseNumber" TEXT NOT NULL,
    "endorsements" JSONB NOT NULL,
    "notes" TEXT,
    CONSTRAINT "License_issueId_fkey" FOREIGN KEY ("issueId") REFERENCES "Issue" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Mvr" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "issueId" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "violationsCount" INTEGER NOT NULL,
    "cleanRecord" BOOLEAN NOT NULL,
    "notes" TEXT,
    CONSTRAINT "Mvr_issueId_fkey" FOREIGN KEY ("issueId") REFERENCES "Issue" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DrugTest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "issueId" TEXT NOT NULL,
    "result" TEXT NOT NULL,
    "substance" TEXT NOT NULL,
    "lab" TEXT NOT NULL,
    "accreditedBy" TEXT NOT NULL,
    "notes" TEXT,
    CONSTRAINT "DrugTest_issueId_fkey" FOREIGN KEY ("issueId") REFERENCES "Issue" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Physical" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "issueId" TEXT NOT NULL,
    "medicalExaminer" TEXT NOT NULL,
    "expirationNoticeSent" BOOLEAN NOT NULL,
    "notes" TEXT,
    CONSTRAINT "Physical_issueId_fkey" FOREIGN KEY ("issueId") REFERENCES "Issue" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Training" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "issueId" TEXT NOT NULL,
    "trainingType" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "certificateNumber" TEXT NOT NULL,
    "notes" TEXT,
    CONSTRAINT "Training_issueId_fkey" FOREIGN KEY ("issueId") REFERENCES "Issue" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Registration" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "issueId" TEXT NOT NULL,
    "plateNumber" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "notes" TEXT,
    CONSTRAINT "Registration_issueId_fkey" FOREIGN KEY ("issueId") REFERENCES "Issue" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AnnualInspection" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "issueId" TEXT NOT NULL,
    "inspectionLocation" TEXT NOT NULL,
    "inspectorName" TEXT NOT NULL,
    "passed" BOOLEAN NOT NULL,
    "notes" TEXT,
    CONSTRAINT "AnnualInspection_issueId_fkey" FOREIGN KEY ("issueId") REFERENCES "Issue" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Maintenance" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "issueId" TEXT NOT NULL,
    "maintenanceType" TEXT NOT NULL,
    "odometer" INTEGER NOT NULL,
    "notes" TEXT,
    CONSTRAINT "Maintenance_issueId_fkey" FOREIGN KEY ("issueId") REFERENCES "Issue" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "RoadsideInspection" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "issueId" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "officerName" TEXT NOT NULL,
    "notes" TEXT,
    "violations" JSONB NOT NULL,
    CONSTRAINT "RoadsideInspection_issueId_fkey" FOREIGN KEY ("issueId") REFERENCES "Issue" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AlcoholTest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "issueId" TEXT NOT NULL,
    "result" TEXT NOT NULL,
    "substance" TEXT NOT NULL,
    "lab" TEXT NOT NULL,
    "accreditedBy" TEXT NOT NULL,
    "notes" TEXT,
    CONSTRAINT "AlcoholTest_issueId_fkey" FOREIGN KEY ("issueId") REFERENCES "Issue" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "HosViolation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "issueId" TEXT NOT NULL,
    "violationType" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "notes" TEXT,
    CONSTRAINT "HosViolation_issueId_fkey" FOREIGN KEY ("issueId") REFERENCES "Issue" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Hazmat" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "issueId" TEXT NOT NULL,
    "endorsementType" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "expirationDate" DATETIME NOT NULL,
    "notes" TEXT,
    CONSTRAINT "Hazmat_issueId_fkey" FOREIGN KEY ("issueId") REFERENCES "Issue" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Accident" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "issueId" TEXT NOT NULL,
    "isFatality" BOOLEAN NOT NULL,
    "isReportable" BOOLEAN NOT NULL,
    "isInjury" BOOLEAN NOT NULL,
    "isTow" BOOLEAN NOT NULL,
    "isCitation" BOOLEAN NOT NULL,
    "isNeedReport" BOOLEAN NOT NULL,
    "isDrugTest" BOOLEAN NOT NULL,
    "numberFatalities" INTEGER,
    "locationAddress" TEXT NOT NULL,
    "locationCity" TEXT NOT NULL,
    "locationState" TEXT NOT NULL,
    "locationZip" TEXT NOT NULL,
    "reportNumber" TEXT,
    "specimenNumber" TEXT,
    "description" TEXT NOT NULL,
    "notes" TEXT,
    "attachments" JSONB NOT NULL,
    CONSTRAINT "Accident_issueId_fkey" FOREIGN KEY ("issueId") REFERENCES "Issue" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CorrectiveAction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "issueId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "assignedById" TEXT NOT NULL,
    "assignedToId" TEXT NOT NULL,
    "assignmentNotes" TEXT,
    "violations" JSONB NOT NULL,
    "completionDate" DATETIME,
    "completionNotes" TEXT,
    "signature" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "CorrectiveAction_issueId_fkey" FOREIGN KEY ("issueId") REFERENCES "Issue" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "CorrectiveAction_assignedById_fkey" FOREIGN KEY ("assignedById") REFERENCES "Person" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "CorrectiveAction_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "Person" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Organization_dotNumber_key" ON "Organization"("dotNumber");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_personId_key" ON "User"("personId");

-- CreateIndex
CREATE UNIQUE INDEX "Equipment_vin_key" ON "Equipment"("vin");

-- CreateIndex
CREATE UNIQUE INDEX "License_issueId_key" ON "License"("issueId");

-- CreateIndex
CREATE UNIQUE INDEX "Mvr_issueId_key" ON "Mvr"("issueId");

-- CreateIndex
CREATE UNIQUE INDEX "DrugTest_issueId_key" ON "DrugTest"("issueId");

-- CreateIndex
CREATE UNIQUE INDEX "Physical_issueId_key" ON "Physical"("issueId");

-- CreateIndex
CREATE UNIQUE INDEX "Training_issueId_key" ON "Training"("issueId");

-- CreateIndex
CREATE UNIQUE INDEX "Registration_issueId_key" ON "Registration"("issueId");

-- CreateIndex
CREATE UNIQUE INDEX "AnnualInspection_issueId_key" ON "AnnualInspection"("issueId");

-- CreateIndex
CREATE UNIQUE INDEX "Maintenance_issueId_key" ON "Maintenance"("issueId");

-- CreateIndex
CREATE UNIQUE INDEX "RoadsideInspection_issueId_key" ON "RoadsideInspection"("issueId");

-- CreateIndex
CREATE UNIQUE INDEX "AlcoholTest_issueId_key" ON "AlcoholTest"("issueId");

-- CreateIndex
CREATE UNIQUE INDEX "HosViolation_issueId_key" ON "HosViolation"("issueId");

-- CreateIndex
CREATE UNIQUE INDEX "Hazmat_issueId_key" ON "Hazmat"("issueId");

-- CreateIndex
CREATE UNIQUE INDEX "Accident_issueId_key" ON "Accident"("issueId");
