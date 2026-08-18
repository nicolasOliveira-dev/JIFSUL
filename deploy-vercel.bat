@echo off
setlocal

where vercel >nul 2>&1
if errorlevel 1 (
  npx vercel@latest %*
) else (
  vercel %*
)

endlocal
