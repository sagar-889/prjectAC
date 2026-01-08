import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import Razorpay from "https://esm.sh/razorpay@2.9.2"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { amount, currency = "INR", receipt } = await req.json()

        // Initialize Razorpay
        const razorpay = new Razorpay({
            key_id: Deno.env.get('RAZORPAY_KEY_ID') || 'placeholder_id',
            key_secret: Deno.env.get('RAZORPAY_KEY_SECRET') || 'placeholder_secret',
        })

        const options = {
            amount: Math.round(amount * 100), // amount in the smallest currency unit
            currency,
            receipt,
        }

        const order = await razorpay.orders.create(options)

        return new Response(
            JSON.stringify(order),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 200
            },
        )
    } catch (error) {
        return new Response(
            JSON.stringify({ error: error.message }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 400
            },
        )
    }
})
