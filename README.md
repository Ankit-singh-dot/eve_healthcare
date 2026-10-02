# EVE Healthcare Backend Assignment

This is a backend service for diagnostic test bookings and simulated payments, built with Express.js, TypeScript, and Prisma ORM.

## Technologies Used
- Node.js & Express.js
- TypeScript
- Prisma ORM
- PostgreSQL
- Redis (Caching)
- JWT Authentication
- Zod (Validation)
- Winston (Structured Logging)
- Swagger (API Documentation)
- Docker & Docker Compose

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- PostgreSQL (Local or Neon DB)

### Installation
1. Clone the repository and navigate into the project directory.
2. Install dependencies:
   ```bash
   npm install
   ```

### Environment Variables
Create a `.env` file in the root directory and configure the following variables:
```
PORT=3000
DATABASE_URL="postgresql://postgres:password@localhost:5432/eve_healthcare?schema=public"
JWT_SECRET="your_super_secret_jwt_key"
```
*Note: If you are using Neon DB, simply replace `DATABASE_URL` with your Neon DB connection string.*

### Database Setup
To initialize the database schema, run:
```bash
npx prisma db push
```

### Running with Docker (Recommended)
You can run the entire ecosystem (Database, Redis, and Node.js API) with a single command:
```bash
docker-compose up --build
```
This automatically sets up the database schema and starts the server on port 3000.

### Running Manually
If you don't want to use Docker:
```bash
npm run dev
```

## API Documentation
Swagger documentation is available at:
`http://localhost:3000/api-docs`

## Features & Edge Cases Handled
1. **Authentication**: JWT-based auth with secure password hashing.
2. **Database Design**: Proper relation tables (`CentreTest`) handling many-to-many relationships between centres and tests, including price at a specific centre.
3. **Idempotent Webhook**: The payment webhook endpoint prevents duplicate booking updates and duplicate payments from corrupting the state.
4. **Validation**: Zod is used to validate incoming request bodies, params, and queries.
5. **Structured Logging**: Winston is implemented to ensure logs are easily queryable and readable in production.
6. **Redis Caching**: Implemented Cache-Aside pattern for fetching diagnostic centres, drastically improving read times.
7. **Rate Limiting**: `express-rate-limit` prevents brute-force attacks and spam requests.
8. **Pagination**: Offset-based pagination added to `GET /api/centres` and `GET /api/tests`.
9. **Dockerized Setup**: Ready for production deployment using Docker and Docker Compose.

## Database Schema Design
- `User`: Stores user credentials and profile.
- `DiagnosticCentre`: Stores diagnostic centres.
- `DiagnosticTest`: Stores available tests globally.
- `CentreTest`: Join table that links a `DiagnosticTest` to a `DiagnosticCentre` and includes a `price` field (as prices may vary by centre).
- `Booking`: Links a user, a test, and a centre along with appointment details, amount, status (`PENDING`, `CONFIRMED`, `FAILED`, `CANCELLED`), and `paymentId` (used to ensure idempotency).

## Important Assumptions
- All endpoints for creating centres and tests are currently protected by a regular user authentication token for demonstration purposes. In a real-world scenario, these would require `ADMIN` privileges.
- Payment Service simulates success 80% of the time, and immediately updates the booking. The webhook also allows an external mock provider to confirm the payment asynchronously.
- The `paymentId` provided in the mock payment process can be used to simulate the webhook call.

## Future Improvements
Given more time, I would:
- Add comprehensive Unit and Integration tests using Jest and Supertest.
- Setup a background worker queue (like BullMQ/Celery equivalent) to handle sending booking confirmation emails.
- Enhance the CI/CD pipeline using GitHub Actions.
