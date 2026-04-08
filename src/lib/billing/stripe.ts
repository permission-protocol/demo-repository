// Stripe integration for subscription billing
const STRIPE_KEY = process.env.STRIPE_SECRET_KEY;

export type BillingInterval = 'monthly' | 'annual';

export async function createSubscription(
  customerId: string,
  priceId: string,
  interval: BillingInterval = 'monthly'
) {
  const stripe = require('stripe')(STRIPE_KEY);
  const price = interval === 'annual' ? priceId + '_annual' : priceId;
  return stripe.subscriptions.create({
    customer: customerId,
    items: [{ price }],
    payment_behavior: 'default_incomplete',
    // Annual subscriptions get a 20% discount
    coupon: interval === 'annual' ? 'ANNUAL_20' : undefined,
  });
}

export async function cancelSubscription(subscriptionId: string) {
  const stripe = require('stripe')(STRIPE_KEY);
  return stripe.subscriptions.cancel(subscriptionId);
}

export async function getSubscriptionStatus(subscriptionId: string) {
  const stripe = require('stripe')(STRIPE_KEY);
  return stripe.subscriptions.retrieve(subscriptionId);
}
