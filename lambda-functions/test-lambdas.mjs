import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const LAMBDA_URLS = {
  generateHook: process.env.VITE_LAMBDA_GENERATE_HOOK,
  generateAssembly: process.env.VITE_LAMBDA_GENERATE_ASSEMBLY,
  translateContent: process.env.VITE_LAMBDA_TRANSLATE_CONTENT
};

async function testGenerateHook() {
  console.log('\n🧪 Testing generateHook...');
  try {
    const response = await fetch(LAMBDA_URLS.generateHook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: 'AI is transforming content creation',
        niche: 'Technology',
        platform: 'Instagram',
        hookStyle: 'engaging',
        targetAudience: 'creators',
        tone: 'professional'
      })
    });
    
    const data = await response.json();
    console.log('✅ Status:', response.status);
    console.log('📊 Response:', JSON.stringify(data, null, 2));
    return response.ok;
  } catch (error) {
    console.log('❌ Error:', error.message);
    return false;
  }
}

async function testGenerateAssembly() {
  console.log('\n🧪 Testing generateAssembly...');
  try {
    const response = await fetch(LAMBDA_URLS.generateAssembly, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: 'Check out this amazing AI tool that helps creators!',
        platform: 'all',
        contentFormat: 'text',
        processingMode: 'standard'
      })
    });
    
    const data = await response.json();
    console.log('✅ Status:', response.status);
    console.log('📊 Response:', JSON.stringify(data, null, 2));
    return response.ok;
  } catch (error) {
    console.log('❌ Error:', error.message);
    return false;
  }
}

async function testTranslateContent() {
  console.log('\n🧪 Testing translateContent...');
  try {
    const response = await fetch(LAMBDA_URLS.translateContent, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: 'Hello, welcome to Creator Copilot!',
        targetLanguage: 'Hindi',
        culturalContext: 'India',
        accessibilityLevel: 'standard'
      })
    });
    
    const data = await response.json();
    console.log('✅ Status:', response.status);
    console.log('📊 Response:', JSON.stringify(data, null, 2));
    return response.ok;
  } catch (error) {
    console.log('❌ Error:', error.message);
    return false;
  }
}

async function runAllTests() {
  console.log('🚀 Starting Lambda Function Tests...\n');
  console.log('Lambda URLs:');
  console.log('- generateHook:', LAMBDA_URLS.generateHook || '❌ NOT SET');
  console.log('- generateAssembly:', LAMBDA_URLS.generateAssembly || '❌ NOT SET');
  console.log('- translateContent:', LAMBDA_URLS.translateContent || '❌ NOT SET');
  
  if (!LAMBDA_URLS.generateHook || !LAMBDA_URLS.generateAssembly || !LAMBDA_URLS.translateContent) {
    console.log('\n❌ Please set all Lambda URLs in your .env file first!');
    return;
  }

  const results = {
    generateHook: await testGenerateHook(),
    generateAssembly: await testGenerateAssembly(),
    translateContent: await testTranslateContent()
  };

  console.log('\n📋 Test Summary:');
  console.log('generateHook:', results.generateHook ? '✅ PASSED' : '❌ FAILED');
  console.log('generateAssembly:', results.generateAssembly ? '✅ PASSED' : '❌ FAILED');
  console.log('translateContent:', results.translateContent ? '✅ PASSED' : '❌ FAILED');
  
  const allPassed = Object.values(results).every(r => r);
  console.log('\n' + (allPassed ? '🎉 All tests passed!' : '⚠️ Some tests failed'));
}

runAllTests();
