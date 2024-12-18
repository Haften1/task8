<?php
session_start();
require($_SERVER['DOCUMENT_ROOT'] . '/vendor/autoload.php');
require('classes/App.php');

$fileName = $_FILES['thefile']['name'];
$tmpName = $_FILES['thefile']['tmp_name'];
$serverPath = 'files/' . $fileName;
$yandexPath = $_SESSION['curpath'] . $fileName;


// Перемещаем файл в директорию на сервере
if (!move_uploaded_file($tmpName, $serverPath)) {
    die('Ошибка при перемещении файла.');
}

// Проверяем, существует ли файл на Яндекс.Диске
$obj = new classes\App();

try {
    if ($obj->disk->getResource($yandexPath)->has()) {
        // Если файл уже существует
        $response = [
            'result' => 'error',
            'text' => "Файл $fileName уже загружен.",
            'fileName' => $fileName,
            'curpath' => $yandexPath
        ];
    } else {
        // Загружаем файл на Яндекс.Диск
        $result = $obj->uploadFile($serverPath, $yandexPath);
        $response = [
            'result' => $result, 
            'fileName' => $fileName,
            'curpath' => $yandexPath
        ];
    }
    header('Content-type: application/json');
    echo json_encode($response);
} catch (Exception $e) {
    
    $response = [
        'result' => 'error',
        'text' => 'Ошибка при загрузке файла на Яндекс.Диск: ' . $e->getMessage()
    ];
    header('Content-type: application/json');
    echo json_encode($response);
}
exit;
?>
