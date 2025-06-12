<?php
session_start();
require_once 'conexao.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    $nome_completo = trim($_POST['nome_completo']);
    $email = trim($_POST['email']);
    $cpf = trim($_POST['cpf']);
    $telefone = trim($_POST['telefone']);
    $cep = trim($_POST['cep']);
    $endereco = trim($_POST['endereco']);
    $senha = $_POST['senha']; 
    $confirmar_senha = $_POST['confirmar_senha'];

    if (empty($nome_completo) || empty($email) || empty($cpf) || empty($cep) || empty($senha)) {
        $_SESSION['register_error'] = "Por favor, preencha todos os campos obrigatórios.";
        header("Location: cadastro.php");
        exit();
    }
    
 
    if ($senha !== $confirmar_senha) {
        $_SESSION['register_error'] = "As senhas não coincidem. Tente novamente.";
        header("Location: cadastro.php");
        exit();
    }


    $senha_hash = password_hash($senha, PASSWORD_DEFAULT);
    
    
    try {
        $sql = "INSERT INTO usuarios (nome_completo, email, cpf, senha_hash, telefone, endereco, cep) 
                VALUES (:nome, :email, :cpf, :senha_hash, :telefone, :endereco, :cep)";
        
        $stmt = $conn->prepare($sql);
        
        $stmt->bindParam(':nome', $nome_completo);
        $stmt->bindParam(':email', $email); 
        $stmt->bindParam(':cpf', $cpf);
        $stmt->bindParam(':senha_hash', $senha_hash); 
        $stmt->bindParam(':telefone', $telefone);
        $stmt->bindParam(':endereco', $endereco);
        $stmt->bindParam(':cep', $cep);
        

        $stmt->execute();
        
        $_SESSION['success_message'] = "Cadastro realizado com sucesso! Faça o login para continuar.";
        header("Location: login.php");
        exit();

    } catch(PDOException $e) {
        if ($e->getCode() == 23000) {
            if (strpos($e->getMessage(), 'email') !== false) {
                $_SESSION['register_error'] = "Este endereço de email já está cadastrado.";
            } elseif (strpos($e->getMessage(), 'cpf') !== false) {
                $_SESSION['register_error'] = "Este CPF já está cadastrado.";
            } else {
                $_SESSION['register_error'] = "Email ou CPF já cadastrado no sistema.";
            }
        } else {
            $_SESSION['register_error'] = "Ocorreu um erro ao realizar o cadastro. Tente novamente mais tarde.";
            error_log("Erro no cadastro: " . $e->getMessage());
        }
        
        header("Location: cadastro.php");
        exit();
    }
    
} else {
    header("Location: cadastro.php");
    exit();
}
?>