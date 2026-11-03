@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo.
echo === NELACOSTE work: локальный запуск ===
echo.

where node >nul 2>nul
if errorlevel 1 (
  echo Не найден Node.js. Скачай версию LTS с https://nodejs.org , установи и запусти этот файл ещё раз.
  pause
  exit /b 1
)

if not exist .env.local (
  copy /y .env.example .env.local >nul
  echo Создан файл .env.local. Сейчас он откроется в блокноте:
  echo   1. Найди строку  # ADMIN_PASSWORD=
  echo   2. Убери # в начале и впиши свой пароль, например:  ADMIN_PASSWORD=моя-длинная-фраза-123
  echo   3. Сохрани файл (Ctrl+S) и закрой блокнот.
  echo.
  notepad .env.local
)

if not exist node_modules (
  echo Ставлю зависимости, это займёт пару минут...
  call npm install
)

echo.
echo Сайт:    http://localhost:3000
echo Админка: http://localhost:3000/admin
echo Остановить: Ctrl+C
echo.
call npm run dev
pause
