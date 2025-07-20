#!/bin/bash

# Migration script from SQLite to PostgreSQL
echo "🚀 Migrating to PostgreSQL production database..."

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "❌ ERROR: DATABASE_URL environment variable not set"
    echo "Please add your DigitalOcean connection string to .env"
    exit 1
fi

echo "📋 Step 1: Generating Prisma client..."
npx prisma generate

echo "📋 Step 2: Pushing schema to production database..."
npx prisma db push

echo "📋 Step 3: Seeding production database..."
npx prisma db seed

echo "📋 Step 4: Testing connection..."
node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.organization.count().then(count => {
  console.log('✅ Connection successful! Organizations in database:', count);
  prisma.\$disconnect();
}).catch(err => {
  console.error('❌ Connection failed:', err.message);
  process.exit(1);
});
"

echo "🎉 Migration complete! Your app is ready for production."
echo "💡 Remember to update your deployment environment variables." 