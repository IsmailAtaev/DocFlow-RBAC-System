# DocFlow-RBAC-System
### NodeTS, Nest, Kysely, PostgreSql

DocFlow RBAC System is a secure document management platform that implements Role-Based Access Control "RBAC-(Role-Based Access Control)". It allows users to create, view, and manage documents based on their roles and permissions. The system supports document types, custom user permissions, and flexible role assignments to ensure structured and secure access to all document workflows.

### Strart project 
Create in PostgreSql Database name: nest
npm i
npm install dotenv-cli --save-dev
npm run migrate
npm run generate:types
npm run seed:rbac
npm run start:dev