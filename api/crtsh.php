<?php

header('Content-Type: application/json'); // Set JSON content type
header("Access-Control-Allow-Origin: *"); // Allow all origins
header("Access-Control-Allow-Methods: GET, POST, OPTIONS"); // Allow specific HTTP methods
header("Access-Control-Allow-Headers: Content-Type, Authorization");
/**
 * Fetch subdomains for a given domain using crt.sh.
 *
 * @param string $domain The domain to search for subdomains.
 * @return array An array of unique subdomains.
 * @throws Exception If there is an error fetching or processing the data.
 */
function fetchSubdomains($domain) {
    // Validate domain
    if (empty($domain) || !filter_var('http://' . $domain, FILTER_VALIDATE_URL)) {
        throw new Exception("Invalid domain: $domain");
    }

    // Construct the URL for crt.sh
    $url = "https://crt.sh/?q=%25.$domain&output=json";

    // Initialize cURL
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);

    // Fetch the data
    $response = curl_exec($ch);
    if ($response === false) {
        $error = curl_error($ch);
        curl_close($ch);
        throw new Exception("Failed to fetch data from crt.sh: $error");
    }
    curl_close($ch);

    // Decode the JSON response
    $data = json_decode($response, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception("JSON Decode Error: " . json_last_error_msg());
    }

    // Validate response structure
    if (!is_array($data)) {
        throw new Exception("Invalid response format from crt.sh");
    }

    // Extract subdomains
    $subdomains = [];
    foreach ($data as $entry) {
        if (isset($entry['name_value']) && is_string($entry['name_value'])) {
            $subdomains = array_merge($subdomains, explode("\n", $entry['name_value']));
        }
    }

    // Return unique, trimmed subdomains
    return array_unique(array_map('trim', $subdomains));
}

try {
    // Get domain from query parameter
    $domain = isset($_GET['domain']) ? trim($_GET['domain']) : '';
    if (empty($domain)) {
        throw new Exception("No domain provided");
    }

    error_log("Fetching subdomains for: $domain");

    // Fetch subdomains
    $subdomains = fetchSubdomains($domain);

    // Return JSON response
    echo json_encode([
        'subdomains' => array_values($subdomains), // Ensure indexed array
        'error' => null
    ]);

} catch (Exception $e) {
    // Log detailed error
    error_log("Error fetching subdomains for $domain: " . $e->getMessage() . "\n" . $e->getTraceAsString());

    // Return JSON error response
    http_response_code(400); // Set appropriate status code
    echo json_encode([
        'subdomains' => [],
        'error' => $e->getMessage()
    ]);
    exit;
}