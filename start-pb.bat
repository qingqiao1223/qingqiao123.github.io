@echo off
chcp 65001 >nul
echo ====================================
echo  校园二手平台 - PocketBase 启动脚本
echo ====================================
echo.

REM 检查 pocketbase.exe 是否存在
if not exist "pocketbase.exe" (
    echo [错误] 找不到 pocketbase.exe
    echo.
    echo 请先下载 PocketBase：
    echo 1. 打开 https://pocketbase.io/docs/
    echo 2. 下载 Windows 版本
    echo 3. 解压后将 pocketbase.exe 放到本目录
    echo.
    pause
    exit /b 1
)

echo 启动 PocketBase 管理后台...
echo 访问地址：http://127.0.0.1:8090/_/
echo 按 Ctrl+C 停止服务
echo.
pocketbase.exe serve --http=127.0.0.1:8090

pause
