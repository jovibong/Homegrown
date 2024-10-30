<?php
header('Content-Type: application/json');

// Enable CORS if needed for testing locally
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

// Check if the request method is POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method Not Allowed']);
    exit;
}

$rawData = file_get_contents("php://input");
$data = json_decode($rawData, true);

if (isset($data['chat_id'], $data['user'], $data['message'])) {
    $filePath = 'json/chat.json';

    if (file_exists($filePath)) {
        $jsonString = file_get_contents($filePath);
        $jsonArray = json_decode($jsonString, true);

        $chatIndex = null;
        foreach ($jsonArray['chats'] as $index => $chat) {
            if ($chat['chat_id'] === $data['chat_id']) {
                $chatIndex = $index;
                break;
            }
        }

        if ($chatIndex !== null) {
            $jsonArray['chats'][$chatIndex]['conversations'][] = [
                'message_id' => $data['message_id'],
                'timestamp' => $data['timestamp'],
                'user' => $data['user'],
                'message' => $data['message']
            ];

            if (file_put_contents($filePath, json_encode($jsonArray, JSON_PRETTY_PRINT))) {
                echo json_encode(['success' => true, 'new_message' => $data]);
            } else {
                echo json_encode(['success' => false, 'message' => 'Failed to write to JSON file']);
            }
        } else {
            echo json_encode(['success' => false, 'message' => 'Chat not found']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'JSON file does not exist']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid data received']);
}
?>
