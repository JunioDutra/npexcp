# Log Parser Project

## Overview

This is a web application project that uses Node.js, TypeScript, and PostgreSQL.

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Setup Instructions

1. Clone this repository:
   ```bash
   git clone git@github.com:JunioDutra/npexcp.git app
   cd app
   ```

2. Create or edit a `.env.container` file in the `project` directory with the required environment variables:
   ```bash
   # Example environment variables
   DATABASE_HOST=database
   DATABASE_PORT=5432
   DATABASE_USERNAME=dev
   DATABASE_PASSWORD=dev
   DATABASE_NAME=dev
   PORT=3000
   ```

## Running the Application

### Using Docker Compose

1. Start the application and database:
   ```bash
   docker-compose up --build
   ```

2. The application will be available at [http://localhost:3000](http://localhost:3000)

3. To shut down the application:
   ```bash
   docker-compose down
   ```

### Database

PostgreSQL database will be accessible:
- Host: localhost
- Port: 5432
- User: dev
- Password: dev
- Database: dev

## Development

### Testing

1. Run the tests:
   ```bash
   cd app/project
   yarn test
   ```

### Local Development

1. Install dependencies:
   ```bash
   cd app/project
   yarn install
   ```

2. Run the development server:
   ```bash
   yarn start:dev
   ```

### Running Migrations

Migrations are automatically run when the Docker container starts.

To manually run migrations:
```bash
yarn run typeorm migration:run -- -d src/datasource.ts
```

### Building the Project

```bash
yarn build
```

## endpoints

- root: http://localhost:3000
- swagger: http://localhost:3000/api