# Webinform React Frontend

A modern React frontend for the Webinform newsletter subscription service.

## Features
- Subscribe users to the newsletter
- Unsubscribe users
- View total subscriber count
- See recent subscribers
- Responsive and clean UI
- API integration with backend

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/tolacika/webinform.git
   cd webinform/react
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### Running the App
Start the development server:
```bash
npm run dev
```
The app will be available at [http://localhost:5173](http://localhost:5173) by default.


## API Endpoints
The frontend communicates with the backend API (see `php/readme.md` for details):
- `POST /subscribe` — Subscribe a user
- `DELETE /unsubscribe` — Unsubscribe a user
- `GET /count` — Get subscriber count
- `GET /recent` — Get recent subscribers
