// Stripe integration for subscription billing
const STRIPE_KEY = process.env.STRIPE_SECRET_KEY;

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
