import { readFileSync } from 'fs';

const sampleData = JSON.parse(readFileSync('./result.sample.json', 'utf-8'));

const payload = {
  serverId: "1",
  data: sampleData
};

const response = await fetch('http://localhost:3000/api/servers', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload)
});

console.log('Status:', response.status);
console.log('Response:', await response.json());
