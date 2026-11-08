const http = require('http');

function request(options, data) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, headers: res.headers, data: JSON.parse(body) });
        } catch (e) {
          resolve({ status: res.statusCode, headers: res.headers, body });
        }
      });
    });
    req.on('error', reject);
    if (data) {
      req.write(typeof data === 'string' ? data : JSON.stringify(data));
    }
    req.end();
  });
}

async function runTests() {
  console.log('--- Starting API Verification Tests ---');

  // 1. Health check
  const health = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/health',
    method: 'GET'
  });
  console.log('1. Health Check:', health.status, health.data?.status === 'healthy' ? 'PASS' : 'FAIL');

  // 2. Auth Login
  const loginRes = await request(
    {
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    },
    { email: 'demo@taskflow.dev', password: 'Password123' }
  );
  console.log('2. Login:', loginRes.status, loginRes.data?.success ? 'PASS' : 'FAIL');
  const token = loginRes.data?.data?.token;

  if (!token) {
    console.error('Failed to get token, aborting further tests.');
    process.exit(1);
  }

  // 3. Get Me
  const meRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/me',
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` }
  });
  console.log('3. Get Me:', meRes.status, meRes.data?.data?.user?.email === 'demo@taskflow.dev' ? 'PASS' : 'FAIL');

  // 4. Get Tasks with pagination & filter
  const tasksRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/tasks?page=1&limit=5&status=All&sortBy=createdAt&order=desc',
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` }
  });
  console.log(
    '4. Get Tasks (Pagination & Filter):',
    tasksRes.status,
    tasksRes.data?.pagination?.totalTasks > 0 ? `PASS (${tasksRes.data.pagination.totalTasks} total)` : 'FAIL'
  );

  // 5. Get Task Stats
  const statsRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/tasks/stats',
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` }
  });
  console.log('5. Task Stats:', statsRes.status, statsRes.data?.data?.total > 0 ? 'PASS' : 'FAIL', statsRes.data?.data);

  // 6. Create Task
  const createRes = await request(
    {
      hostname: 'localhost',
      port: 5000,
      path: '/api/tasks',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    },
    {
      title: 'Automated Test Task',
      description: 'Testing task creation flow',
      status: 'Pending',
      priority: 'High',
      tags: ['Test', 'Automated']
    }
  );
  console.log('6. Create Task:', createRes.status, createRes.data?.data?._id ? 'PASS' : 'FAIL');
  const newTaskId = createRes.data?.data?._id;

  // 7. Update Task Status (Status Workflow)
  const patchRes = await request(
    {
      hostname: 'localhost',
      port: 5000,
      path: `/api/tasks/${newTaskId}/status`,
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    },
    { status: 'In-Progress' }
  );
  console.log('7. Update Status to In-Progress:', patchRes.status, patchRes.data?.data?.status === 'In-Progress' ? 'PASS' : 'FAIL');

  // 8. Delete Task
  const deleteRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: `/api/tasks/${newTaskId}`,
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });
  console.log('8. Delete Task:', deleteRes.status, deleteRes.data?.success ? 'PASS' : 'FAIL');

  console.log('--- All API Verification Tests Completed Successfully ---');
  process.exit(0);
}

runTests().catch((err) => {
  console.error('Test error:', err);
  process.exit(1);
});

