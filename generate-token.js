const crypto = require('crypto');

// Generate a secure random token
const token = crypto.randomBytes(32).toString('hex');

console.log('Your API Token:');
console.log(token);
console.log('\nAdd this to your .env file as:');
console.log(`API_TOKEN=${token}`); 