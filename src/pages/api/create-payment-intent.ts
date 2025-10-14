// API endpoint para crear un PaymentIntent de Stripe
import type { APIRoute } from 'astro';
import Stripe from 'stripe';

// Inicializar Stripe con tu clave secreta
// IMPORTANTE: Añade tu clave secreta en .env como STRIPE_SECRET_KEY
const stripe = new Stripe(import.meta.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-10-28.acacia',
});

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { amount, mesaNumero, orderIds } = body;

    // Validar que tenemos los datos necesarios
    if (!amount || !mesaNumero) {
      return new Response(
        JSON.stringify({ error: 'Faltan datos requeridos' }),
        { status: 400 }
      );
    }

    // Crear el PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe usa centavos
      currency: 'eur',
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        mesa_numero: mesaNumero.toString(),
        order_ids: orderIds ? orderIds.join(',') : '',
      },
      description: `Pago Mesa ${mesaNumero} - BarBorja`,
    });

    return new Response(
      JSON.stringify({
        clientSecret: paymentIntent.client_secret,
      }),
      { 
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    console.error('Error creando PaymentIntent:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Error procesando el pago' 
      }),
      { status: 500 }
    );
  }
};
