@echo off
title Sistema de Controle de Acesso - LA Music
color 0A

echo.
echo ========================================
echo   LA Music - Sistema de Catraca
echo ========================================
echo.

:: Verificar se Node.js esta instalado
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERRO] Node.js nao encontrado!
    echo Baixe em: https://nodejs.org
    pause
    exit /b 1
)

:: Verificar se .NET esta instalado
where dotnet >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERRO] .NET SDK nao encontrado!
    echo Baixe em: https://dotnet.microsoft.com/download
    pause
    exit /b 1
)

echo [OK] Node.js encontrado
echo [OK] .NET SDK encontrado
echo.

:: Obter o diretorio atual
set "BASE_DIR=%~dp0"

:: Iniciar Toletus HUB
echo [1/3] Iniciando Toletus HUB...
start "Toletus HUB" cmd /k "cd /d "%BASE_DIR%toletus-hub\src\Toletus.Hub.API" && dotnet run"

:: Aguardar um pouco para o HUB iniciar
timeout /t 5 /nobreak >nul

:: Iniciar Middleware
echo [2/3] Iniciando Middleware...
start "Middleware" cmd /k "cd /d "%BASE_DIR%catraca-middleware" && npm install --silent && npm start"

:: Aguardar um pouco para o Middleware iniciar
timeout /t 3 /nobreak >nul

:: Iniciar Dashboard
echo [3/3] Iniciando Dashboard...
start "Dashboard" cmd /k "cd /d "%BASE_DIR%dashboard" && npm install --silent && npm run dev"

:: Aguardar o Dashboard iniciar
timeout /t 5 /nobreak >nul

echo.
echo ========================================
echo   Sistema iniciado com sucesso!
echo ========================================
echo.
echo   Acesse: http://localhost:5173
echo.
echo   Pressione qualquer tecla para abrir no navegador...
pause >nul

:: Abrir navegador
start http://localhost:5173

echo.
echo Para parar o sistema, feche as 3 janelas de terminal.
echo.
