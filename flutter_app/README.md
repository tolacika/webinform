# Newsletter Subscription Flutter App

This Flutter app allows users to subscribe to a newsletter, view the total number of subscribers, and see the latest subscriber's details. It connects to a backend API for all data operations.

## Features

- Newsletter subscription form (name & email)
- Field validation with error messages
- Success/error feedback after submission
- Displays total subscriber count
- Shows the latest subscriber's name and email
- Data auto-refreshes every 5 seconds and after successful subscription
- Clean Material UI

## API Integration

The app communicates with a backend API (default: `http://192.168.1.76:3000/api`). Can be set
at `lib/main.dart` in the `apiBaseUrl` variable.

### Endpoints Used
- `POST /subscribe` — Subscribe a user
- `GET /count` — Get subscriber count
- `GET /recent` — Get recent subscribers

## Getting Started

### Prerequisites
- [Flutter](https://docs.flutter.dev/get-started/install)
- Backend API running and accessible

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/tolacika/webinform.git
   cd webinform/flutter_app
   ```
2. Install dependencies:
   ```bash
   flutter pub get
   ```

### Running the App
Start the app on your device or emulator:
```bash
flutter run
```

## Configuration

The API base URL is set in `lib/main.dart` as `apiBaseUrl`. Change it if your backend runs on a different address or port.

## Project Structure

- `lib/main.dart` — Main app logic, UI, and API calls
- `README.md` — Project documentation

## License

MIT
