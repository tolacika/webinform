<?php
declare(strict_types=1);

namespace App;

require_once __DIR__ . '/../vendor/autoload.php';

use Exception;
use mysqli;
use DateTime;

/**
 * Newsletter Subscription API
 * Single file application with mysqli
 */
class NewsletterAPI
{
    private mysqli $db;
    private array $config;

    public function __construct()
    {
        $this->config = [
            'db_host' => $_ENV['DB_HOST'] ?? 'mysql',
            'db_user' => $_ENV['DB_USER'] ?? 'root',
            'db_pass' => $_ENV['DB_PASS'] ?? 'example',
            'db_name' => $_ENV['DB_NAME'] ?? 'newsletter'
        ];

        $this->initDatabase();
        $this->createTables();
    }

    private function initDatabase(): void
    {
        mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
        
        try {
            $this->db = new mysqli(
                $this->config['db_host'],
                $this->config['db_user'],
                $this->config['db_pass'],
                $this->config['db_name']
            );
            $this->db->set_charset('utf8mb4');
        } catch (Exception $e) {
            $this->sendJsonResponse(['error' => 'Database connection failed'], 500);
        }
    }

    private function createTables(): void
    {
        $sql = "CREATE TABLE IF NOT EXISTS subscribers (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(40) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            INDEX idx_email (email),
            INDEX idx_created_at (created_at)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";

        try {
            $this->db->query($sql);
        } catch (Exception $e) {
            error_log("Table creation failed: " . $e->getMessage());
        }
    }

    public function handleRequest(): void
    {
        header('Content-Type: application/json');
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type');

        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            http_response_code(200);
            exit;
        }

        $method = $_SERVER['REQUEST_METHOD'];
        $path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
        $pathParts = explode('/', trim($path, '/'));

        try {
            switch ($method) {
                case 'POST':
                    if (end($pathParts) === 'subscribe') {
                        $this->subscribe();
                    } else {
                        $this->sendJsonResponse(['error' => 'Invalid endpoint'], 404);
                    }
                    break;

                case 'DELETE':
                    if (end($pathParts) === 'unsubscribe') {
                        $this->unsubscribe();
                    } else {
                        $this->sendJsonResponse(['error' => 'Invalid endpoint'], 404);
                    }
                    break;

                case 'GET':
                    $endpoint = end($pathParts);
                    switch ($endpoint) {
                        case 'count':
                            $this->getSubscriberCount();
                            break;
                        case 'recent':
                            $this->getRecentSubscribers();
                            break;
                        case 'stats':
                            $this->getStats();
                            break;
                        default:
                            $this->sendJsonResponse(['error' => 'Invalid endpoint'], 404);
                    }
                    break;

                default:
                    $this->sendJsonResponse(['error' => 'Method not allowed'], 405);
            }
        } catch (Exception $e) {
            error_log("API Error: " . $e->getMessage());
            $this->sendJsonResponse(['error' => 'Internal server error'], 500);
        }
    }

    private function subscribe(): void
    {
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!$input) {
            $this->sendJsonResponse(['error' => 'Invalid JSON input'], 400);
        }

        $name = trim($input['name'] ?? '');
        $email = trim($input['email'] ?? '');

        // Validation
        $errors = $this->validateSubscriber($name, $email);
        if (!empty($errors)) {
            $this->sendJsonResponse(['errors' => $errors], 400);
        }

        // Is the email already subscribed?
        try {
            $stmt = $this->db->prepare("SELECT id FROM subscribers WHERE email = ?");
            $stmt->bind_param("s", $email);
            $stmt->execute();
            $result = $stmt->get_result();

            if ($result->num_rows > 0) {
                $this->sendJsonResponse(['errors' => ['email' => 'Email already subscribed']], 409);
            }
        } catch (Exception $e) {
            throw new Exception("Database error: " . $e->getMessage());
        }

        try {
            $stmt = $this->db->prepare("INSERT INTO subscribers (name, email) VALUES (?, ?)");
            $stmt->bind_param("ss", $name, $email);
            $stmt->execute();

            $this->sendJsonResponse([
                'success' => true,
                'message' => 'Successfully subscribed',
                'subscriber_id' => $this->db->insert_id
            ], 201);
        } catch (Exception $e) {
            if ($this->db->errno === 1062) { // Duplicate entry
                $this->sendJsonResponse(['errors' => ['email' => 'Email already subscribed']], 409);
            } else {
                throw $e;
            }
        }
    }

    private function unsubscribe(): void
    {
        $input = json_decode(file_get_contents('php://input'), true);
        $email = trim($input['email'] ?? '');

        if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $this->sendJsonResponse(['error' => 'Valid email is required'], 400);
        }

        $stmt = $this->db->prepare("DELETE FROM subscribers WHERE email = ?");
        $stmt->bind_param("s", $email);
        $stmt->execute();

        if ($stmt->affected_rows > 0) {
            $this->sendJsonResponse(['success' => true, 'message' => 'Successfully unsubscribed']);
        } else {
            $this->sendJsonResponse(['error' => 'Email not found'], 404);
        }
    }

    private function getSubscriberCount(): void
    {
        $result = $this->db->query("SELECT COUNT(*) as count FROM subscribers");
        $row = $result->fetch_assoc();
        
        $this->sendJsonResponse(['count' => (int)$row['count']]);
    }

    private function getRecentSubscribers(): void
    {
        $stmt = $this->db->prepare("
            SELECT name, email, created_at 
            FROM subscribers 
            ORDER BY created_at DESC 
            LIMIT 5
        ");
        $stmt->execute();
        $result = $stmt->get_result();
        
        $subscribers = [];
        while ($row = $result->fetch_assoc()) {
            $subscribers[] = [
                'name' => $row['name'],
                'email' => $row['email'],
                'created_at' => $row['created_at']
            ];
        }

        $this->sendJsonResponse(['recent_subscribers' => $subscribers]);
    }

    private function getStats(): void
    {
        // Get total count
        $countResult = $this->db->query("SELECT COUNT(*) as count FROM subscribers");
        $count = $countResult->fetch_assoc()['count'];

        // Get latest subscriber
        $latestResult = $this->db->query("
            SELECT name, email, created_at 
            FROM subscribers 
            ORDER BY created_at DESC 
            LIMIT 1
        ");
        $latest = $latestResult->fetch_assoc();

        $this->sendJsonResponse([
            'total_subscribers' => (int)$count,
            'latest_subscriber' => $latest ?: null
        ]);
    }

    private function validateSubscriber(string $name, string $email): array
    {
        $errors = [];

        // Name validation
        if (empty($name)) {
            $errors['name'] = 'Name is required';
        } elseif (strlen($name) < 5 || strlen($name) > 40) {
            $errors['name'] = 'Name must be between 5 and 40 characters';
        }

        // Email validation
        if (empty($email)) {
            $errors['email'] = 'Email is required';
        } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $errors['email'] = 'Invalid email format';
        }

        return $errors;
    }

    private function sendJsonResponse(array $data, int $statusCode = 200): void
    {
        if (!isset($data['success'])) {
            $data['success'] = false;
        }
        http_response_code($statusCode);
        echo json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
        exit;
    }

    public function __destruct()
    {
        if (isset($this->db)) {
            $this->db->close();
        }
    }
}

// Initialize and run the API
try {
    $api = new NewsletterAPI();
    $api->handleRequest();
} catch (Exception $e) {
    error_log("Fatal error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Internal server error']);
}