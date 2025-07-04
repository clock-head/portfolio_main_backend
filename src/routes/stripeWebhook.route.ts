import express from 'express';
import { Router, Request, Response } from 'express';
import Stripe from 'stripe';
const stripeController = require('../controllers/stripeController');
import bodyParser from 'body-parser';

const router = Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil',
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

router.post('/', async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'] as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (error) {
    console.error('[Webhook Error]', error);
    return res.status(400).send(`Webhook Error: ${(error as Error).message}`);
  }

  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object as Stripe.Checkout.Session;
      console.log('[Stripe] Checkout complete:', session);

      break;
    default:
      console.log(`[Stripe] Unhandled event type: ${event.type}`);
  }

  res.status(200).send({ received: true });
  console.log('webhook');
});

export default router;
