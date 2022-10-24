import { NextApiRequest, NextApiResponse } from "next";
import { IProduct } from "../../contexts/CartContext";
import { stripe } from "../../lib/stripe";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { products } = req.body as { products: IProduct[] };

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed." });
  }

  if (!products || products.length === 0) {
    return res.status(400).json({ error: 'Products not found.' });
  }

  const successUrl = `${process.env.NEXT_URL}/success?session_id={CHECKOUT_SESSION_ID}`;
  const cancelUrl = `${process.env.NEXT_URL}/`;

  const checkoutSession = await stripe.checkout.sessions.create({
    success_url: successUrl,
    cancel_url: cancelUrl,
    mode: 'payment',
    line_items: products.map((product) => ({
      price: product.defaultPriceId,
      quantity: 1,
    })),
    shipping_address_collection: {
      allowed_countries: ['BR'],
    },
    shipping_options: [
      {
        shipping_rate_data: {
          type: 'fixed_amount',
          fixed_amount: {
            amount: 2500,
            currency: 'brl',
          },
          display_name: 'Entrega Padrão',
          delivery_estimate: {
            minimum: {
              unit: 'business_day',
              value: 7,
            },
            maximum: {
              unit: 'business_day',
              value: 21,
            },
          }
        }
      },
      {
        shipping_rate_data: {
          type: 'fixed_amount',
          fixed_amount: {
            amount: 5500,
            currency: 'brl',
          },
          display_name: 'Sedex',

          delivery_estimate: {
            minimum: {
              unit: 'business_day',
              value: 4,
            },
            maximum: {
              unit: 'business_day',
              value: 12,
            },
          }
        }
      },
    ],
  })

  return res.status(201).json({
    checkoutUrl: checkoutSession.url
  })
}