<?php
//$data = print_r(json_decode(file_get_contents('php://input'), false), true);
$data = print_r(file_get_contents('php://input'), true);

$ficjson="../plans/".$_GET['id']."/rapport.json";
echo $ficjson;
file_put_contents($ficjson, $data);
