@echo off
setlocal enabledelayedexpansion
title Sistema de Controle de Acesso - LA Music
color 0A
chcp 65001 >nul 2>&1

echo.
echo ╔═══════════════════════════════════════════════════════════╗
echo ║         LA Music - Sistema de Controle de Acesso          ║
echo ╚═══════════════════════════════════════════════════════════╝
echo.

:: Obter diretorio atual
set "BASE_DIR=%~dp0"
cd /d "%BASE_DIR%"

:: ============================================
:: VERIFICAR PRE-REQUISITOS
:: ============================================

echo [1/6] Verificando pre-requisitos...

:: Verificar Node.js
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERRO] Node.js nao encontrado!
    echo.
    echo Baixe e instale o Node.js em: https://nodejs.org
    echo Apos instalar, feche este terminal e execute novamente.
    echo.
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
echo    [OK] Node.js %NODE_VERSION%

:: Verificar .NET SDK
where dotnet >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERRO] .NET SDK nao encontrado!
    echo.
    echo Baixe e instale o .NET SDK 9 em: https://dotnet.microsoft.com/download
    echo Apos instalar, feche este terminal e execute novamente.
    echo.
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('dotnet --version') do set DOTNET_VERSION=%%i
echo    [OK] .NET SDK %DOTNET_VERSION%

:: ============================================
:: VERIFICAR/BAIXAR TOLETUS HUB
:: ============================================

echo.
echo [2/6] Verificando Toletus HUB...

if not exist "%BASE_DIR%toletus-hub\src\Toletus.Hub.API\Toletus.Hub.API.csproj" (
    echo    Toletus HUB nao encontrado. Baixando...

    :: Verificar se curl existe
    where curl >nul 2>nul
    if %ERRORLEVEL% NEQ 0 (
        echo.
        echo [ERRO] curl nao encontrado. Baixe manualmente:
        echo https://github.com/Toletus/hub/archive/refs/heads/main.zip
        echo Extraia na pasta toletus-hub/
        echo.
        pause
        exit /b 1
    )

    :: Baixar ZIP
    echo    Baixando de github.com/Toletus/hub...
    curl -L -o "%BASE_DIR%toletus-hub.zip" "https://github.com/Toletus/hub/archive/refs/heads/main.zip" 2>nul

    if not exist "%BASE_DIR%toletus-hub.zip" (
        echo [ERRO] Falha ao baixar. Baixe manualmente:
        echo https://github.com/Toletus/hub/archive/refs/heads/main.zip
        pause
        exit /b 1
    )

    :: Extrair ZIP
    echo    Extraindo...
    powershell -command "Expand-Archive -Path '%BASE_DIR%toletus-hub.zip' -DestinationPath '%BASE_DIR%' -Force"

    :: Renomear pasta
    if exist "%BASE_DIR%hub-main" (
        if exist "%BASE_DIR%toletus-hub" rmdir /s /q "%BASE_DIR%toletus-hub"
        rename "%BASE_DIR%hub-main" "toletus-hub"
    )

    :: Limpar
    del "%BASE_DIR%toletus-hub.zip" 2>nul

    echo    [OK] Toletus HUB baixado
) else (
    echo    [OK] Toletus HUB encontrado
)

:: ============================================
:: CRIAR ARQUIVO .ENV SE NAO EXISTIR
:: ============================================

echo.
echo [3/6] Verificando configuracao...

if not exist "%BASE_DIR%catraca-middleware\.env" (
    echo    Criando arquivo .env...
    (
        echo PORT=3000
        echo TOLETUS_HUB_URL=http://localhost:5110
        echo CATRACA_IP=192.168.1.100
        echo CATRACA_TYPE=3
        echo EMUSYS_API_URL=https://api.emusys.com.br/v1
        echo EMUSYS_API_KEY=sua_api_key_aqui
        echo LOG_LEVEL=info
    ) > "%BASE_DIR%catraca-middleware\.env"
    echo    [OK] Arquivo .env criado
) else (
    echo    [OK] Arquivo .env encontrado
)

:: ============================================
:: INSTALAR DEPENDENCIAS
:: ============================================

echo.
echo [4/6] Instalando dependencias...

:: Middleware
if not exist "%BASE_DIR%catraca-middleware\node_modules" (
    echo    Instalando dependencias do Middleware...
    cd /d "%BASE_DIR%catraca-middleware"
    call npm install --silent >nul 2>&1
    echo    [OK] Middleware
) else (
    echo    [OK] Middleware (ja instalado)
)

:: Dashboard
if not exist "%BASE_DIR%dashboard\node_modules" (
    echo    Instalando dependencias do Dashboard...
    cd /d "%BASE_DIR%dashboard"
    call npm install --silent >nul 2>&1
    echo    [OK] Dashboard
) else (
    echo    [OK] Dashboard (ja instalado)
)

cd /d "%BASE_DIR%"

:: ============================================
:: INICIAR SERVICOS
:: ============================================

echo.
echo [5/6] Iniciando servicos...

:: Iniciar Toletus HUB
echo    Iniciando Toletus HUB (porta 5110)...
start "Toletus HUB" /min cmd /c "cd /d "%BASE_DIR%toletus-hub\src\Toletus.Hub.API" && dotnet run"

:: Aguardar HUB iniciar
echo    Aguardando Toletus HUB iniciar...
timeout /t 8 /nobreak >nul

:: Iniciar Middleware
echo    Iniciando Middleware (porta 3000)...
start "Middleware" /min cmd /c "cd /d "%BASE_DIR%catraca-middleware" && npm start"

:: Aguardar Middleware iniciar
timeout /t 3 /nobreak >nul

:: Iniciar Dashboard
echo    Iniciando Dashboard (porta 5173)...
start "Dashboard" /min cmd /c "cd /d "%BASE_DIR%dashboard" && npm run dev"

:: Aguardar Dashboard iniciar
timeout /t 5 /nobreak >nul

:: ============================================
:: FINALIZAR
:: ============================================

echo.
echo [6/6] Sistema iniciado!

echo.
echo ╔═══════════════════════════════════════════════════════════╗
echo ║                  SISTEMA INICIADO!                        ║
echo ╠═══════════════════════════════════════════════════════════╣
echo ║                                                           ║
echo ║   Acesse no navegador: http://localhost:5173              ║
echo ║                                                           ║
echo ║   Servicos rodando:                                       ║
echo ║   - Toletus HUB:  http://localhost:5110                   ║
echo ║   - Middleware:   http://localhost:3000                   ║
echo ║   - Dashboard:    http://localhost:5173                   ║
echo ║                                                           ║
echo ╚═══════════════════════════════════════════════════════════╝
echo.

:: Abrir navegador
echo Abrindo navegador...
timeout /t 2 /nobreak >nul
start http://localhost:5173

echo.
echo Para parar o sistema, feche as janelas minimizadas na barra de tarefas.
echo.
pause
