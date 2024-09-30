@echo off
REM Navigate to the directory where this batch file is located
cd /d %~dp0

REM Run the Node.js script to export the file structure
node export-file-structure.js

REM Notify the user that the structure has been exported
echo Project structure has been exported to structure.json
pause

