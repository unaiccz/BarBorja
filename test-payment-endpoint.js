// Script para probar el endpoint de payment-intent
import fetch from 'node-fetch';

async function testPaymentEndpoint() {
    console.log('🧪 Probando endpoint de payment-intent...');
    
    const testData = {
        amount: 2500, // 25€ en centavos
        currency: 'eur',
        metadata: {
            tipo: 'domicilio',
            nombre: 'Test Usuario',
            telefono: '123456789',
            direccion: 'Test Address'
        }
    };

    try {
        console.log('📤 Enviando request a http://localhost:4321/api/create-payment-intent');
        console.log('📊 Datos:', JSON.stringify(testData, null, 2));

        const response = await fetch('http://localhost:4321/api/create-payment-intent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(testData)
        });

        console.log('📡 Status:', response.status);
        console.log('📝 Headers:', Object.fromEntries(response.headers.entries()));

        const responseText = await response.text();
        console.log('📄 Response body:', responseText);

        if (response.ok) {
            const data = JSON.parse(responseText);
            console.log('✅ Success:', data);
        } else {
            console.error('❌ Error response:', responseText);
        }

    } catch (error) {
        console.error('❌ Error general:', error.message);
    }
}

testPaymentEndpoint();