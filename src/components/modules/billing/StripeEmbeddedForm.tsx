import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { PrimaryButton } from "../../shared/PrimaryButton";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

function CheckoutForm({ onSuccess, paymentMethodType = "card" }: Readonly<{ onSuccess?: () => void; paymentMethodType?: string }>) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    if (!stripe || !elements) return;
    const { error: stripeError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin + "/dashboard/facturacion",
      },
    });
    if (stripeError) setError(stripeError.message || "Error al procesar el pago");
    else if (onSuccess) onSuccess();
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement options={{ paymentMethodOrder: [paymentMethodType] }} />
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <PrimaryButton type="submit" disabled={!stripe || loading}>
        {loading ? "Procesando..." : "Pagar"}
      </PrimaryButton>
    </form>
  );
}

export function StripeEmbeddedForm({ clientSecret, onSuccess, paymentMethodType = "card" }: Readonly<{ clientSecret: string; onSuccess?: () => void; paymentMethodType?: string }>) {
  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <CheckoutForm onSuccess={onSuccess} paymentMethodType={paymentMethodType} />
    </Elements>
  );
}
