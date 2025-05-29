const API_URL: string = import.meta.env.VITE_BASE_URL;

export async function createStripeCheckoutSession({ invoiceId, amount, client }: { invoiceId: string; amount: number; client: string }) {
  const response = await fetch(`${API_URL}/stripe/create-checkout-session`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ invoiceId, amount, client })
  });
  if (!response.ok) {
    throw new Error('Error al crear la sesión de Stripe');
  }
  return response.json();
}

export async function createStripePaymentIntent({ amount, currency = 'USD' }: { amount: number; currency?: string }) {
  const response = await fetch(`${API_URL}/stripe/create-payment-intent`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount, currency })
  });
  if (!response.ok) {
    throw new Error('Error al crear el Payment Intent de Stripe');
  }
  return response.json();
}