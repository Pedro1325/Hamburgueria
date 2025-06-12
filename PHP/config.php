<?php
$host = 'localhost';
$db_name = 'ruppers_burger';
$username = 'root'; 
$password = '';
$conn = null;

try {
    $dsn = "mysql:host=" . $host . ";dbname=" . $db_name . ";charset=utf8";
    $conn = new PDO($dsn, $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    echo "Conexão com o banco de dados '" . $db_name . "' estabelecida com sucesso!";

} catch(PDOException $e) {
    die("Erro: Não foi possível conectar ao banco de dados. " . $e->getMessage());
}
?>