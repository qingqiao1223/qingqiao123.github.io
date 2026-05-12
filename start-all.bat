@echo off
chcp 65001 >nul
title 校园二手平台 - 启动
echo ================================================
echo  校园二手平台 - 一键启动
echo ================================================
echo.
echo 启动方式：
echo   1. 先启动后端 (PocketBase)
echo   2. 再启动前端 (Next.js)
echo.
echo 两个终端窗口都打开后，访问：
echo   前端：http://localhost:3000
echo   后台：http://127.0.0.1:8090/_/
echo.
echo ================================================
echo.

:menu
echo 请选择：
echo   [1] 启动 PocketBase 后端
echo   [2] 启动 Next.js 前端
echo   [3] 同时启动前后端
echo   [0] 退出
echo.

set /p choice="输入数字后回车: "

if "%choice%"=="1" goto start_pb
if "%choice%"=="2" goto start_front
if "%choice%"=="3" goto start_both
if "%choice%"=="0" exit /b

echo 无效选择
goto menu

:start_pb
if not exist "pocketbase.exe" (
    echo.
    echo [!!] 找不到 pocketbase.exe
    echo.
    echo 请手动下载：
    echo   方法 1：https://pocketbase.io/docs/  → 下载 Windows 版本
    echo   方法 2：https://soft-onepage.vercel.app/ 找 PocketBase 下载
    echo.
    echo 下载后解压，把 pocketbase.exe 放到本目录
    echo.
    pause
    exit /b
)
echo 启动 PocketBase (http://127.0.0.1:8090)
echo 后台管理：http://127.0.0.1:8090/_/
start "PocketBase" cmd /c "pocketbase.exe serve --http=127.0.0.1:8090 & pause"
goto end

:start_front
echo 启动 Next.js 前端 (http://localhost:3000)
start "Next.js" cmd /c "npm run dev & pause"
goto end

:start_both
call :start_pb
timeout /t 2 /nobreak >nul
call :start_front
goto end

:end
echo.
echo 启动完成！
pause
