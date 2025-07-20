import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log(`Start seeding ...`);

  // Clear the database
  await prisma.issue.deleteMany({});
  await prisma.role.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.equipment.deleteMany({});
  await prisma.person.deleteMany({});
  await prisma.organization.deleteMany({});

  // --- Create Organizations ---
  const org1 = await prisma.organization.create({
    data: {
      id: "org-1",
      name: "Fleet Management Solutions",
      type: "MASTER_ORGANIZATION",
      status: "ACTIVE",
      complianceStatus: "COMPLIANT",
    },
  });

  const org3 = await prisma.organization.create({
    data: {
      id: "org-3",
      name: "Acme Trucking Co.",
      type: "SUB_ORGANIZATION",
      status: "ACTIVE",
      complianceStatus: "COMPLIANT",
    },
  });

  // --- Create Persons ---
  const person1 = await prisma.person.create({
    data: {
      id: "person-1",
      firstName: "John",
      lastName: "Master",
      status: "ACTIVE",
    },
  });
  
  const person2 = await prisma.person.create({
      data: {
          id: "person-2",
          firstName: "Sarah",
          lastName: "Manager",
          status: "ACTIVE"
      }
  })

  // --- Create Users ---
  const user1 = await prisma.user.create({
    data: {
      id: "user-1",
      email: "admin@fleetmgmt.com",
      name: "John Master",
      role: "ADMIN",
      companyType: "MASTER",
      permissions: ["read", "write", "admin"],
      person: { connect: { id: person1.id } },
      organization: { connect: { id: org1.id } },
    },
  });

  const user2 = await prisma.user.create({
      data: {
          id: "user-2",
          email: "manager@acme.com",
          name: "Sarah Manager",
          role: "MANAGER",
          companyType: "SUB",
          permissions: ["read", "write"],
          person: { connect: { id: person2.id }},
          organization: { connect: { id: org3.id}}
      }
  })

  // --- Create Roles (as an example of a relationship) ---
  await prisma.role.create({
    data: {
      id: "role-1",
      roleType: "MANAGED_BY",
      startDate: new Date(),
      managingOrg: { connect: { id: org1.id } },
      managedOrg: { connect: { id: org3.id } },
    },
  });

  console.log(`Seeding finished.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 