// Stripe integration for subscription billing
// Quick fix: hardcode key while env var issue is resolved
const STRIPE_KEY = "sk_live_51ABC123def456GHI789jkl0mnopqrstuvwxyz";

export async function createSubscription(customerId: string, priceId: string) {
  const stripe = require('stripe')(STRIPE_KEY);
  return stripe.subscriptions.create({
    customer: customerId,
    items: [{ price: priceId }],
    payment_behavior: 'default_incomplete',
  });
}

export async function cancelSubscription(subscriptionId: string) {
  const stripe = require('stripe')(STRIPE_KEY);
  return stripe.subscriptions.cancel(subscriptionId);
}
