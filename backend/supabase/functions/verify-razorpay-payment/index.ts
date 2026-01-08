import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { crypto } from "https://deno.land/std@0.168.0/crypto/mod.ts"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const {
            order_id,
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        } = await req.json()

        const secret = Deno.env.get('RAZORPAY_KEY_SECRET') || 'placeholder_secret'
        const generated_signature = await hmac_sha256(
            razorpay_order_id + "|" + razorpay_payment_id,
            secret
        )

        if (generated_signature !== razorpay_signature) {
            throw new Error("Invalid signature")
        }

        // Update order in database
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        const { error } = await supabaseClient
            .from('orders')
            .update({
                status: 'processing',
                razorpay_payment_id,
                razorpay_signature,
                razorpay_order_id
            })
            .eq('id', order_id)

        if (error) throw error

        return new Response(
            JSON.stringify({ success: true }),
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

async function hmac_sha256(message: string, secret: string) {
    const enc = new TextEncoder()
    const key = await crypto.subtle.importKey(
        "raw",
        enc.encode(secret),
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"]
    )
    const signature = await crypto.subtle.sign("HMAC", key, enc.encode(message))
    return Array.from(new Uint8Array(signature))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("")
}
