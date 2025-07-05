import { Request, Response } from 'express';
import { CustomRequest, CustomResponse } from 'src/types/User';
import { Consultation } from '../models';
import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil',
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

module.exports = {
  callWebhook: async (req: Request, res: Response) => {
    const sig = req.headers['stripe-signature'] as string;

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
  },

  createCheckoutSession: async (req: CustomRequest, res: Response) => {
    const user = req.user;
    const { consultationId } = req.body;

    if (!user) {
      return res.json({
        status: 404,
        message:
          'User not found [Leak detected] User auth is a middleware level containment protocol.',
      });
    }

    try {
      const consultation = await Consultation.findByPk(consultationId);
      if (!consultation)
        return res.status(404).json({ message: 'Consultation not found.' });

      const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: 'Consultation Booking',
              },
              unit_amount: 5000, // $50.00 for example
            },
            quantity: 1,
          },
        ],
        customer_email: user.email,
        success_url: `${process.env.FRONTEND_DOMAIN}/payment-status/status=success?consultationId=${consultationId}`,
        cancel_url: `${process.env.FRONTEND_DOMAIN}/payment-status/status=failure`,
        metadata: {
          consultationId,
        },
      });

      console.log('[Stripe] Checkout session created:', session);

      return res.status(200).json({ checkoutUrl: session.url });
    } catch (error) {
      console.error('[Stripe Checkout Error]', error);
      return res.status(500).json({ message: 'Stripe Internal Server Error.' });
    }
  },
};
