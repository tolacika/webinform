# Newsletter Subscription API

A simple PHP REST API for managing newsletter subscriptions using MySQL (via `mysqli`).

## Features
- Subscribe users with name and email
- Unsubscribe users by email
- Get total subscriber count
- Get recent subscribers
- Input validation and error handling

## Endpoints

### Subscribe
- **POST** `/subscribe`
- **Body:** JSON `{ "name": "John Doe", "email": "john@example.com" }`
- **Response:** Success or validation errors

### Unsubscribe
- **DELETE** `/unsubscribe`
- **Body:** JSON `{ "email": "john@example.com" }`
- **Response:** Success or error if not found

### Get Subscriber Count
- **GET** `/count`
- **Response:** `{ "count": 123 }`

### Get Recent Subscribers
- **GET** `/recent`
- **Response:** `{ "recent_subscribers": [ ... ] }`

## Database
- Table: `subscribers`
  - `id` INT, auto-increment, primary key
  - `name` VARCHAR(40)
  - `email` VARCHAR(255), unique
  - `created_at` TIMESTAMP

## Environment Variables
- `DB_HOST` (default: `mysql`)
- `DB_USER` (default: `root`)
- `DB_PASS` (default: `example`)
- `DB_NAME` (default: `newsletter`)

## Usage
1. Configure environment variables as needed.
2. Ensure MySQL is running and accessible.
3. Run the API via Docker.
4. Use HTTP requests to interact with endpoints.

## Example (using curl)
```
curl -X POST http://localhost:8000/subscribe -H "Content-Type: application/json" -d '{"name":"Alice","email":"alice@example.com"}'
curl -X DELETE http://localhost:8000/unsubscribe -H "Content-Type: application/json" -d '{"email":"alice@example.com"}'
curl http://localhost:8000/count
curl http://localhost:8000/recent
curl http://localhost:8000/stats
```