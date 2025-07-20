# Party Model Relationships - Updated Structure

## Overview
This document explains the enhanced party model that now supports locations, staff relationships, and normalized contact information.

## Core Tables

### 1. Organizations Table
- **Types**: `MASTER_ORGANIZATION`, `SUB_ORGANIZATION`, `LOCATION`
- **Purpose**: Represents companies, sub-companies, and physical locations
- **Key Changes**: Removed address/contact fields (moved to separate tables)

### 2. Persons Table
- **Purpose**: Represents all people in the system
- **Key Changes**: Removed email/phone fields (moved to separate tables)

### 3. Equipment Table
- **Purpose**: Represents all vehicles and equipment
- **Key Changes**: Removed registration/insurance fields (moved to issue tables)

## New Role Types

### LOCATION Role (Org → Org)
- **Purpose**: Links a company to its sub-locations
- **Example**: Company A → Terminal A, Store B, Office C
- **Structure**: `partyA_type: ORGANIZATION, partyB_type: ORGANIZATION, roleType: LOCATION`

### STAFF Role (Org → Person)
- **Purpose**: Links a location to people who work there
- **Example**: Terminal A → Driver John, Manager Sarah
- **Structure**: `partyA_type: ORGANIZATION, partyB_type: PERSON, roleType: STAFF`

### DRIVER Role (Org → Person)
- **Purpose**: Links a company to its drivers
- **Example**: Company A → Driver John
- **Structure**: `partyA_type: ORGANIZATION, partyB_type: PERSON, roleType: DRIVER`

## Contact Information Tables

### Phones Table
- **Links to**: `personId` (personal phones) or `roleId` (work phones)
- **Types**: `PERSONAL`, `WORK`, `MOBILE`, `FAX`, `EMERGENCY`
- **Example**: Driver John has personal mobile + work phone linked to his STAFF role

### Emails Table
- **Links to**: `personId` (personal emails) or `roleId` (work emails)
- **Types**: `PERSONAL`, `WORK`, `NOTIFICATION`, `BILLING`
- **Example**: Driver John has personal email + work email linked to his STAFF role

### Addresses Table
- **Links to**: `personId` (home addresses) or `organizationId` (company/location addresses)
- **Types**: `HOME`, `WORK`, `BILLING`, `SHIPPING`, `MAILING`
- **Example**: Driver John has home address + Terminal A has work address

## Example Relationships

### Scenario: Driver John works for Company A out of Terminal A

1. **Organizations**:
   - Company A (type: SUB_ORGANIZATION)
   - Terminal A (type: LOCATION)

2. **Person**:
   - John (person record)

3. **Roles**:
   - Company A → Terminal A (roleType: LOCATION)
   - Company A → John (roleType: DRIVER)
   - Terminal A → John (roleType: STAFF)

4. **Contact Information**:
   - John's personal phone (personId: John)
   - John's work phone (roleId: STAFF role)
   - John's personal email (personId: John)
   - John's work email (roleId: STAFF role)
   - John's home address (personId: John)
   - Terminal A's address (organizationId: Terminal A)

## Benefits of This Structure

1. **Flexibility**: Any party can have any relationship with any other party
2. **Scalability**: Easy to add new role types and relationship types
3. **Normalization**: Contact information is properly normalized
4. **Audit Trail**: All relationships have start/end dates
5. **Multi-location Support**: Companies can have unlimited locations
6. **Staff Assignment**: People can work at specific locations while belonging to parent company

## Query Examples

### Find all drivers at a specific terminal:
```sql
SELECT p.* FROM persons p
JOIN roles r ON r.partyB_id = p.id
JOIN roles location_role ON location_role.partyB_id = r.partyA_id
WHERE location_role.partyA_id = 'terminal-a-id'
AND r.roleType = 'STAFF'
AND location_role.roleType = 'LOCATION';
```

### Find all contact info for a person:
```sql
-- Personal info
SELECT * FROM phones WHERE personId = 'person-id';
SELECT * FROM emails WHERE personId = 'person-id';
SELECT * FROM addresses WHERE personId = 'person-id';

-- Work info (via roles)
SELECT p.* FROM phones p
JOIN roles r ON p.roleId = r.id
WHERE r.partyB_id = 'person-id' AND r.roleType = 'STAFF';
```

This structure provides maximum flexibility while maintaining data integrity and supporting complex organizational hierarchies. 