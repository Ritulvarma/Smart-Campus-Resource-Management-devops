# Smart Campus RMS - Prototype (CA-1)

This folder contains a small runnable prototype (frontend + backend) for the Smart Campus Resource Management System used for the DevOps CA-1.

Quick start (Windows PowerShell):

```powershell
cd 'c:\Users\RITUL\Downloads\devops lab'
npm install
npm start
```

Open http://localhost:3000 in a browser. You can sign up, sign in, and add resources under "Resources".

Notes:
- The server uses `db.json` (lowdb) for file-based storage. It's suitable for demo only.
- The JWT secret is set in `server.js` as a placeholder; change it before publishing.
- To publish to GitHub, initialize a repo in this folder and push to your remote.
