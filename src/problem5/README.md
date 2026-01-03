My solution to problem 5: A CRUDE server with Express.js, typescript

## Setup Guide

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager
- PostgreSQL (v12 or higher)

### Installation Steps

1. **Clone the repository**

   ```bash
   git clone https://github.com/QuangNV23062004/Nguyen_Vinh_Quang.git
   ```

2. **Navigate to the project directory**

   ```bash
   cd Nguyen_Vinh_Quang/src/problem5
   ```

3. **Install dependencies**

   ```bash
   npm install
   ```

4. **Database Setup**

   - Install and start PostgreSQL on your machine
   - Create a new database:
     ```sql
     CREATE DATABASE your_database_name;
     ```

5. **Configure environment variables**

   - Create a `.env` file in the project root
   - Add the following configuration:

     ```env
     DB_DATABASE=your_database_name
     DB_HOST=localhost
     DB_PORT=5432
     DB_USERNAME=your_postgres_username
     DB_PASSWORD=your_postgres_password
     DB_TYPE=postgres
     DB_SYNCHRONIZE=true

     PORT=4000
     MOBILE_URL=http://localhost:8081
     WEBSITE_URL=http://localhost:3000
     ```

   - Replace the placeholder values with your actual database credentials

6. **Start the development server**

   ```bash
   npm run dev
   ```

7. **Access the API**
   - The server will run on `http://localhost:4000`
   - Health check endpoint: `http://localhost:4000/`

### API Endpoints

#### Resources CRUD Operations

- **Create Resource**

  - `POST /resources`
    - Body: `{ "name": "string", "description": "string" }`
    - `name` is required
    - `description` is optional

- **List Resources (Paginated)**

  - `GET /resources?page=1&limit=10&search=&searchBy=name&order=ASC&orderBy=created_at&includeDeleted=false`
    - All query parameters are optional
    - `page`: must be a positive number; defaults to `1` if not provided
    - `limit`: must be a positive number between 1-100; defaults to `10` if not provided
    - `search`: the value to search for; defaults to empty string
    - `searchBy`: the field to search in, either `name` or `description`; defaults to `name`
    - `order`: sorting order, accepts `asc`, `ASC`, `desc`, or `DESC`; defaults to `ASC`
    - `orderBy`: sorting criteria, can be `name`, `description`, `created_at`, or `updated_at`; defaults to `created_at`
    - `includeDeleted`: whether to include soft-deleted resources, accepts `true` or `false`; defaults to `false`

- **Get All Resources**

  - `GET /resources/all?search=&searchBy=name&order=ASC&orderBy=created_at&includeDeleted=false`
    - All query parameters are optional
    - `search`: the value to search for; defaults to empty string
    - `searchBy`: the field to search in, either `name` or `description`; defaults to `name`
    - `order`: sorting order, accepts `asc`, `ASC`, `desc`, or `DESC`; defaults to `ASC`
    - `orderBy`: sorting criteria, can be `name`, `description`, `created_at`, or `updated_at`; defaults to `created_at`
    - `includeDeleted`: whether to include soft-deleted resources, accepts `true` or `false`; defaults to `false`

- **Get Resource by ID**

  - `GET /resources/:id?includeDeleted=false`
    - `includeDeleted`: whether to include soft-deleted resources, accepts `true` or `false`; defaults to `false`

- **Update Resource**

  - `PATCH /resources/:id`
  - Body: `{ "name": "string", "description": "string", "status": "ACTIVE" | "INACTIVE" }`
    - All fields are optional
    - Only non-deleted resources can be updated

- **Soft Delete Resource**

  - `DELETE /resources/:id`
    - Only non-deleted resources can be soft deleted

- **Restore Resource**

  - `POST /resources/:id/restore`
    - Restores a previously soft-deleted resource

- **Hard Delete Resource**
  - `DELETE /resources/:id/hard`
    - Permanently removes the resource from the database

### Additional Commands

- **Run with auto-reload**: `npm run dev`

### Tech Stack

- **Framework**: Express.js
- **Language**: TypeScript
- **ORM**: TypeORM
- **Database**: PostgreSQL
- **Dependency Injection**: TypeDI
- **Validation**: class-validator, class-transformer

### Project Structure

```
src/
├── application/        # Business logic layer
│   ├── enums/          # Status codes and enums
│   └── exceptions/     # Custom exception classes
├── config/             # Configuration files
├── infrastructure/     # Infrastructure layer
│   ├── database/       # Database configuration
│   └── http/           # HTTP middlewares
├── interfaces/         # TypeScript interfaces
├── modules/            # Feature modules
│   └── resources/      # Resource CRUD module
├── shared/             # Shared utilities
└── index.ts            # Application entry point
```

### Design Rationale

- The modular approach is inspired by NestJS's module structure, creating separated modules with clear boundaries that are easier to work with and scale in the long run, despite an initial overhead.
- The config folder provides centralized environment variable management, similar to the approach used in my recent Golang repositories.
- Design patterns such as Domain-Driven Design and Clean Architecture have influenced the folder structure and naming conventions.

### Notes

- `DB_SYNCHRONIZE=true` will auto-sync database schema (use `false` in production)
- Transactions are implemented for write operations
- Soft delete functionality is available for data recovery
- Query validation is performed using DTOs with class-validator
