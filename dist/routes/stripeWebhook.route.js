"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const stripe_1 = __importDefault(require("stripe"));
const stripeController = require('../controllers/stripeController');
const router = (0, express_1.Router)();
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2025-06-30.basil',
});
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
router.post('/', async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
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
});
exports.default = router;
