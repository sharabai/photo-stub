@echo off
cd backend
call npm install
start npm run start
cd ..
cd frontend
call npm install
start npm run dev
