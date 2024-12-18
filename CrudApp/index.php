<?php

require($_SERVER['DOCUMENT_ROOT'] . '/vendor/autoload.php');
require('classes/App.php');
$obj = new classes\App();

// Устанавливаем текущий путь
classes\App::setSessionCurPath();

?>

<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link href="css/style.css" rel="stylesheet">
    <title>CRUD Яндекс Диск</title>
</head>
<body>

<?php

// Выводим все папки и файлы
echo '<div class="items">';
$obj->showItems();
echo '</div>';

// Выводим скрытый хайдбар
$obj->hideBar();

// Кнопка для загрузки файлов
$obj->loadItem();

// Показываем текущий путь на Яндекс Диске
classes\App::showCurrentPath();

// Получаем количество элементов в текущей папке
$itemCount = $obj->countItems();

// Отображаем количество элементов внизу страницы
echo '<div class="item-count">Количество элементов: ' . $itemCount . '</div>';

?>

<script src="js/App.js"></script>

</body>
</html>
