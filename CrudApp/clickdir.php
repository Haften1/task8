<?php
session_start();

require($_SERVER['DOCUMENT_ROOT'] . '/vendor/autoload.php');

require('classes/App.php');

$newPath = $_POST['dirPath'] . '/';
$_SESSION['curpath'] = $newPath;


$obj = new classes\App();
ob_start();
$obj->showItems($newPath);
$output = ob_get_contents();
ob_end_clean();

$response = [
    'output' => $output,
    'newpath' => $newPath
];
header('Content-type: application/json');
echo json_encode($response);
exit;
