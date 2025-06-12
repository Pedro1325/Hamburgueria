<?php
session_start();

require_once 'conexao.php'; 

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
  
    $email = $_POST['email'];
    $senha = $_POST['senha'];

    
    $sql = "SELECT id, nome_completo, senha FROM usuarios WHERE email = :email";
    $stmt = $conn->prepare($sql);
    
    
    $stmt->bindParam(':email', $email);
    
    
    $stmt->execute();
    
    
    if ($stmt->rowCount() == 1) {
      
        $usuario = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (password_verify($senha, $usuario['senha'])) {
      
            
        
            $_SESSION['usuario_id'] = $usuario['id'];
            $_SESSION['usuario_nome'] = $usuario['nome_completo'];
            
            
            header("Location: index.php"); 
            exit();
            
        } else {
           
            $_SESSION['login_error'] = "Email ou senha inválidos.";
            header("Location: login.php");
            exit();
        }
    } else {
        
        $_SESSION['login_error'] = "Email ou senha inválidos.";
        header("Location: login.php");
        exit();
    }
} else {
   
    header("Location: login.php");
    exit();
}
?>