const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:7001';
const EMAIL = 'gazzium@gmail.com';
const PASSWORD = 'abc1234';

async function testPaymentFlow() {
  console.log('=== WALLET PAYMENT API - COMPLETE FLOW TEST ===\n');

  try {
    // Step 1: Login
    console.log('1️⃣  LOGIN & GET JWT TOKEN');
    console.log('━'.repeat(50));

    const loginResponse = await fetch(`${BASE_URL}/auth/local`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        identifier: EMAIL,
        password: PASSWORD,
      }),
    });

    const loginData = await loginResponse.json();

    if (!loginData.jwt) {
      console.log('❌ Login failed!');
      console.log(JSON.stringify(loginData, null, 2));
      return;
    }

    const JWT = loginData.jwt;
    console.log('✅ Login successful!');
    console.log(`User: ${loginData.user.email}`);
    console.log(`User ID: ${loginData.user.id}`);
    console.log(`JWT Token: ${JWT.substring(0, 50)}...\n`);

    // Step 2: Get Wallet Balance
    console.log('2️⃣  GET WALLET BALANCE');
    console.log('━'.repeat(50));

    const balanceResponse = await fetch(`${BASE_URL}/api/wallet/balance`, {
      headers: { 'Authorization': `Bearer ${JWT}` },
    });
    const balanceData = await balanceResponse.json();
    console.log(JSON.stringify(balanceData, null, 2));
    console.log('');

    // Step 3: Get Payment Methods
    console.log('3️⃣  GET PAYMENT METHODS');
    console.log('━'.repeat(50));

    const methodsResponse = await fetch(`${BASE_URL}/api/wallet/payment/methods`, {
      headers: { 'Authorization': `Bearer ${JWT}` },
    });
    const methodsData = await methodsResponse.json();
    console.log(JSON.stringify(methodsData, null, 2));
    console.log('');

    // Step 4: Get Transaction History
    console.log('4️⃣  GET TRANSACTION HISTORY');
    console.log('━'.repeat(50));

    const txResponse = await fetch(`${BASE_URL}/api/wallet/transactions?limit=5`, {
      headers: { 'Authorization': `Bearer ${JWT}` },
    });
    const txData = await txResponse.json();
    console.log(JSON.stringify(txData, null, 2));
    console.log('');

    // Step 5: Create Payment Source (K PLUS)
    console.log('5️⃣  CREATE PAYMENT SOURCE (K PLUS - 100 THB)');
    console.log('━'.repeat(50));

    const paymentResponse = await fetch(`${BASE_URL}/api/wallet/payment/create-source`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${JWT}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: 100,
        paymentMethod: 'mobile_banking_kbank',
        returnUri: 'myapp://payment-result',
      }),
    });

    const paymentData = await paymentResponse.json();
    console.log(JSON.stringify(paymentData, null, 2));
    console.log('');

    if (paymentData.success && paymentData.data.authorizeUri) {
      const chargeId = paymentData.data.chargeId;
      const authorizeUri = paymentData.data.authorizeUri;

      console.log('📱 NEXT STEPS:');
      console.log('━'.repeat(50));
      console.log(`✓ Charge ID: ${chargeId}`);
      console.log(`✓ Authorize URI: ${authorizeUri}\n`);
      console.log('To complete payment:');
      console.log('1. Open this URL in your browser:');
      console.log(`   ${authorizeUri}\n`);
      console.log('2. Click "Authorize Test Payment"\n');
      console.log('3. Check payment status with:');
      console.log(`   node -e "fetch('${BASE_URL}/api/wallet/payment/status/${chargeId}', {`);
      console.log(`     headers: {'Authorization': 'Bearer ${JWT.substring(0, 20)}...'}`);
      console.log(`   }).then(r => r.json()).then(console.log)"`);
    }

    console.log('\n=== TEST COMPLETE ===');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
  }
}

testPaymentFlow();
