import { readFileSync } from 'fs';

// 从命令行参数获取 serverId，默认为 "1"
const serverId = process.argv[2] || "1";
// 从环境变量或命令行获取 token
const token = process.env.API_AUTH_TOKEN || process.argv[3] || "my-secure-token-123";

const sampleData = JSON.parse(readFileSync('./result.sample.json', 'utf-8'));

const payload = {
  serverId,
  data: sampleData
};

const response = await fetch('http://localhost:3000/api/servers', {
  method: 'POST',
  headers: { 
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify(payload)
});

console.log('Status:', response.status);
console.log('Response:', await response.json());
