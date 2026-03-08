import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

async function testWithDetails(url, name, payload) {
  console.log(`\n🧪 Testing ${name}...`);
  console.log('URL:', url);
  console.log('Payload:', JSON.stringify(payload, null, 2));
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    const text = await response.text();
    console.log('Status:', response.status);
    console.log('Raw Response:', text);
    
    try {
      const data = JSON.parse(text);
      console.log('Parsed Response:', JSON.stringify(data, null, 2));
    } catch (e) {
      console.log('Could not parse as JSON');
    }
  } catch (error) {
    console.log('❌ Fetch Error:', error.message);
  }
}

async function main() {
  await testWithDetails(
    process.env.VITE_LAMBDA_GENERATE_HOOK,
    'generateHook',
    {
      content: 'AI is transforming content creation',
      niche: 'Technology',
      platform: 'Instagram'
    }
  );
  
  await testWithDetails(
    process.env.VITE_LAMBDA_GENERATE_ASSEMBLY,
    'generateAssembly',
    {
      content: 'Check out this amazing AI tool!'
    }
  );
}

main();
