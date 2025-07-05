"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../models");
const stripe_1 = __importDefault(require("stripe"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2025-06-30.basil',
});
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
module.exports = {
    callWebhook: async (req, res) => {
        const sig = req.headers['stripe-signature'];
        let event;
        try {
            event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
        }
        catch (error) {
            console.error('[Webhook Error]', error);
            return res.status(400).send(`Webhook Error: ${error.message}`);
        }
        switch (event.type) {
            case 'checkout.session.completed':
                const session = event.data.object;
                console.log('[Stripe] Checkout complete:', session);
                break;
            default:
                console.log(`[Stripe] Unhandled event type: ${event.type}`);
        }
        res.status(200).send({ received: true });
        console.log('webhook');
    },
    createCheckoutSession: async (req, res) => {
        const user = req.user;
        const { consultationId } = req.body;
        if (!user) {
            return res.json({
                status: 404,
                message: 'User not found [Leak detected] User auth is a middleware level containment protocol.',
            });
        }
        try {
            const consultation = await models_1.Consultation.findByPk(consultationId);
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
                success_url: `${process.env.FRONTEND_DOMAIN}/payment-status?status=success&consultationId=${consultationId}`,
                cancel_url: `${process.env.FRONTEND_DOMAIN}/payment-status?status=failure`,
                metadata: {
                    consultationId,
                },
            });
            console.log('[Stripe] Checkout session created:', session);
            return res.status(200).json({ checkoutUrl: session.url });
        }
        catch (error) {
            console.error('[Stripe Checkout Error]', error);
            return res.status(500).json({ message: 'Stripe Internal Server Error.' });
        }
    },
};
