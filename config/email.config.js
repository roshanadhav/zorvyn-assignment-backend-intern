export const WELCOME_EMAIL = `
    <div style="font-family: Arial, sans-serif; text-align: center;">
        <h3>Welcome</h3>
        <p>Your account has been created successfully.</p>
        <p>Email: {{email}}</p>
    </div>
`;

export const LOGO_URL = ``;

export const OTP_VERIFICATION_EMAIL = `
    <div style="font-family: Arial, sans-serif; text-align: center;">
        <p>Your OTP is:</p>
        <h2>{{otp}}</h2>
        <p>This OTP is valid for 10 minutes.</p>
    </div>
`;

export const PASSWORD_RESET_OTP_EMAIL = `
    <div style="font-family: Arial, sans-serif; text-align: center;">
        <p>Password Reset OTP:</p>
        <h2>{{otp}}</h2>
        <p>This OTP is valid for 10 minutes.</p>
    </div>
`;

export const doc = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>Finance Backend API Documentation</title>

<style>
body {
  margin: 0;
  font-family: "Segoe UI", sans-serif;
  background: #0f172a;
  color: #e2e8f0;
  display: flex;
}

.sidebar {
  width: 240px;
  background: #020617;
  padding: 20px;
  height: 100vh;
  position: fixed;
}

.sidebar h2 {
  color: #38bdf8;
  font-size: 18px;
}

.sidebar a {
  display: block;
  color: #94a3b8;
  text-decoration: none;
  margin: 10px 0;
}

.sidebar a:hover {
  color: #38bdf8;
}

.main {
  margin-left: 260px;
  padding: 30px;
  width: 100%;
}

.card {
  background: #1e293b;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 10px;
}

h1 {
  color: #38bdf8;
}

h2 {
  color: #22c55e;
}

.endpoint {
  color: #facc15;
}

.method {
  font-weight: bold;
  color: #38bdf8;
}

code {
  background: #020617;
  display: block;
  padding: 10px;
  border-radius: 6px;
  margin-top: 8px;
  overflow-x: auto;
  font-size: 14px;
}

.badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 5px;
  font-size: 12px;
  margin-left: 10px;
}

.admin { background: #ef4444; }
.analyst { background: #facc15; color: black; }
.viewer { background: #22c55e; }
</style>
</head>

<body>

<div class="sidebar">
  <h2>API Docs</h2>
  <a href="#overview">Overview</a>
  <a href="#auth">Auth</a>
  <a href="#records">Records</a>
  <a href="#dashboard">Dashboard</a>
</div>

<div class="main">

<h1 id="overview">Finance Backend API</h1>

<div class="card">
  <h2>Overview</h2>
  <p>Backend system for managing financial records with role-based access control and analytics.</p>
</div>

<div class="card">
  <h2>Roles</h2>
  <p>Viewer → Dashboard only</p>
  <p>Analyst → Read access</p>
  <p>Admin → Full access</p>
</div>

<!-- AUTH -->
<div class="card" id="auth">
  <h2>Authentication APIs</h2>

  <p><span class="method">POST</span> <span class="endpoint">/api/auth/register</span></p>
  <code>{
"name": "Roshan",
"email": "test@gmail.com",
"password": "123456",
"role": "admin",
"adminPasskey": "12"
}</code>

  <p><span class="method">POST</span> <span class="endpoint">/api/auth/login</span></p>
  <code>{
"email": "test@gmail.com",
"password": "123456"
}</code>

  <p><span class="method">POST</span> /api/auth/logout</p>

  <p><span class="method">GET</span> /api/auth/is-auth</p>

  <p><span class="method">POST</span> /api/auth/send-verify-otp</p>

  <p><span class="method">POST</span> /api/auth/verify-account</p>

  <p><span class="method">POST</span> /api/auth/reset-pass-otp-send</p>

  <p><span class="method">POST</span> /api/auth/verify-otp-change-pass</p>
</div>

<!-- RECORDS -->
<div class="card" id="records">
  <h2>Records APIs</h2>

  <p>
    <span class="method">POST</span> 
    <span class="endpoint">/api/records/create</span>
    <span class="badge admin">Admin</span>
  </p>

  <code>{
"amount": 5000,
"type": "expense",
"category": "food",
"note": "dinner"
}</code>

  <p>
    <span class="method">GET</span> 
    <span class="endpoint">/api/records</span>
    <span class="badge analyst">Analyst</span>
    <span class="badge admin">Admin</span>
  </p>

  <code>/api/records?type=expense&page=1&limit=10</code>

  <p>
    <span class="method">PATCH</span> 
    <span class="endpoint">/api/records/:id</span>
    <span class="badge admin">Admin</span>
  </p>

  <code>{
"amount": 7000
}</code>

  <p>
    <span class="method">DELETE</span> 
    <span class="endpoint">/api/records/:id</span>
    <span class="badge admin">Admin</span>
  </p>
</div>

<!-- DASHBOARD -->
<div class="card" id="dashboard">
  <h2>Dashboard APIs</h2>

  <p>
    <span class="method">GET</span> 
    <span class="endpoint">/api/dashbord/summary</span>
    <span class="badge analyst">Analyst</span>
    <span class="badge admin">Admin</span>
  </p>

  <p>
    <span class="method">GET</span> 
    <span class="endpoint">/api/dashbord/category-wise</span>
  </p>

  <p>
    <span class="method">GET</span> 
    <span class="endpoint">/api/dashbord/monthly</span>
  </p>

  <p>
    <span class="method">GET</span> 
    <span class="endpoint">/api/dashbord/recent</span>
  </p>
</div>

<div class="card">
  <h2>Notes</h2>
  <ul>
    <li>JWT authentication via cookies</li>
    <li>Role-based middleware protection</li>
    <li>Soft delete enabled</li>
    <li>Aggregation used for analytics</li>
  </ul>
</div>

</div>
</body>
</html>`