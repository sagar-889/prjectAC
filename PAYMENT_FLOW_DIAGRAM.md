# Payment Flow Diagram

## Complete UPI Payment Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                        CUSTOMER JOURNEY                          │
└─────────────────────────────────────────────────────────────────┘

1. SHOPPING
   ┌──────────────┐
   │ Browse Shop  │
   │ Add to Cart  │
   └──────┬───────┘
          │
          ▼
   ┌──────────────┐
   │  View Cart   │
   │ Review Items │
   └──────┬───────┘
          │
          ▼

2. CHECKOUT
   ┌─────────────────────┐
   │  Checkout Page      │
   │  ─────────────      │
   │  • Contact Info     │
   │  • Shipping Address │
   │  • Use My Location  │
   └──────┬──────────────┘
          │
          ▼
   ┌─────────────────────┐
   │ Proceed to Payment  │
   └──────┬──────────────┘
          │
          ▼

3. PAYMENT PAGE
   ┌─────────────────────────────────────┐
   │         Payment Methods             │
   │  ─────────────────────────────      │
   │  ┌──────┐  ┌──────┐  ┌──────┐     │
   │  │ UPI  │  │ Card │  │ Bank │     │
   │  └──────┘  └──────┘  └──────┘     │
   │  ┌──────┐                          │
   │  │Wallet│                          │
   │  └──────┘                          │
   │                                     │
   │  [Pay ₹XXX.XX]                     │
   └──────┬──────────────────────────────┘
          │
          ▼

4. RAZORPAY MODAL
   ┌─────────────────────────────────────┐
   │      Razorpay Payment Modal         │
   │  ─────────────────────────────      │
   │                                     │
   │  Select Payment Method:             │
   │  ● UPI                              │
   │    ├─ Enter UPI ID                  │
   │    ├─ Scan QR Code                  │
   │    └─ Select UPI App                │
   │  ○ Credit/Debit Card                │
   │  ○ Net Banking                      │
   │  ○ Wallets                          │
   └──────┬──────────────────────────────┘
          │
          ▼

5. UPI PAYMENT OPTIONS
   
   Option A: UPI ID
   ┌─────────────────────┐
   │ Enter UPI ID        │
   │ [user@paytm]        │
   │ [Verify & Pay]      │
   └──────┬──────────────┘
          │
          ▼
   ┌─────────────────────┐
   │ Open UPI App        │
   │ Enter UPI PIN       │
   │ Confirm Payment     │
   └──────┬──────────────┘
   
   Option B: QR Code
   ┌─────────────────────┐
   │  ┌─────────────┐    │
   │  │ QR Code     │    │
   │  │ [█████████] │    │
   │  └─────────────┘    │
   │ Scan with any       │
   │ UPI app             │
   └──────┬──────────────┘
          │
          ▼
   ┌─────────────────────┐
   │ UPI App Opens       │
   │ Enter UPI PIN       │
   │ Confirm Payment     │
   └──────┬──────────────┘
   
   Option C: UPI Intent
   ┌─────────────────────┐
   │ Select UPI App:     │
   │ • PhonePe           │
   │ • Google Pay        │
   │ • Paytm             │
   │ • BHIM              │
   └──────┬──────────────┘
          │
          ▼
   ┌─────────────────────┐
   │ App Opens           │
   │ Auto-filled Details │
   │ Enter UPI PIN       │
   │ Confirm Payment     │
   └──────┬──────────────┘
          │
          ▼

6. PAYMENT PROCESSING
   ┌─────────────────────┐
   │ Processing...       │
   │ Please wait         │
   └──────┬──────────────┘
          │
          ▼

7. PAYMENT SUCCESS
   ┌─────────────────────┐
   │   ✓ Success!        │
   │ Payment Successful  │
   │ Order Confirmed     │
   └──────┬──────────────┘
          │
          ▼
   ┌─────────────────────┐
   │ Redirect to Orders  │
   └─────────────────────┘


┌─────────────────────────────────────────────────────────────────┐
│                      TECHNICAL FLOW                              │
└─────────────────────────────────────────────────────────────────┘

FRONTEND                    BACKEND                    RAZORPAY
────────                    ───────                    ────────

1. User clicks "Pay"
   │
   ├──────────────────────> Create Order
   │                        │
   │                        ├─ Save to DB
   │                        │
   │                        ├──────────────────────> Create Razorpay Order
   │                        │                        │
   │                        │                        ├─ Generate Order ID
   │                        │                        │
   │                        │ <──────────────────────┤ Return Order ID
   │                        │
   │ <──────────────────────┤ Return Order Details
   │
   ├─ Open Razorpay Modal
   │
   ├─ User selects UPI
   │
   ├─ User enters UPI ID
   │
   ├──────────────────────────────────────────────> Process Payment
   │                                                 │
   │                                                 ├─ Send to UPI Network
   │                                                 │
   │                                                 ├─ User approves in app
   │                                                 │
   │ <───────────────────────────────────────────────┤ Payment Success
   │
   ├──────────────────────> Verify Payment
   │                        │
   │                        ├─ Verify Signature
   │                        │
   │                        ├─ Update Order Status
   │                        │
   │ <──────────────────────┤ Verification Success
   │
   ├─ Clear Cart
   │
   ├─ Show Success Message
   │
   └─ Redirect to Orders


WEBHOOK FLOW (Parallel)
────────────────────────

                           RAZORPAY                    BACKEND
                           ────────                    ───────
                           
                           Payment Event
                           │
                           ├──────────────────────────> Webhook Handler
                           │                            │
                           │                            ├─ Verify Signature
                           │                            │
                           │                            ├─ Update Order Status
                           │                            │
                           │ <──────────────────────────┤ Acknowledge
                           │


┌─────────────────────────────────────────────────────────────────┐
│                      DATABASE UPDATES                            │
└─────────────────────────────────────────────────────────────────┘

Order Status Flow:
──────────────────

1. Order Created
   status: 'pending'
   razorpay_order_id: 'order_xxx'
   
2. Payment Initiated
   status: 'pending'
   (waiting for payment)
   
3. Payment Successful
   status: 'processing'
   razorpay_payment_id: 'pay_xxx'
   razorpay_signature: 'signature_xxx'
   
4. Order Shipped
   status: 'shipped'
   tracking_number: 'TRACK123'
   shipped_at: timestamp
   
5. Order Delivered
   status: 'delivered'
   delivered_at: timestamp


┌─────────────────────────────────────────────────────────────────┐
│                      ERROR HANDLING                              │
└─────────────────────────────────────────────────────────────────┘

Payment Failed
──────────────
User enters wrong UPI PIN
   │
   ├─ Razorpay shows error
   │
   ├─ User can retry
   │
   └─ Order remains 'pending'

Payment Cancelled
─────────────────
User closes modal
   │
   ├─ Show "Payment Cancelled" message
   │
   ├─ Order remains 'pending'
   │
   └─ User can retry from orders page

Network Error
─────────────
Connection lost during payment
   │
   ├─ Show error message
   │
   ├─ Webhook updates status (if payment went through)
   │
   └─ User can check order status

Invalid Signature
─────────────────
Signature verification fails
   │
   ├─ Payment rejected
   │
   ├─ Order status: 'failed'
   │
   └─ User notified to contact support


┌─────────────────────────────────────────────────────────────────┐
│                      SECURITY MEASURES                           │
└─────────────────────────────────────────────────────────────────┘

1. API Key Security
   ✓ Public key in frontend (safe)
   ✓ Secret key in backend only
   ✓ Environment variables
   
2. Signature Verification
   ✓ HMAC SHA256 signature
   ✓ Verified on backend
   ✓ Prevents tampering
   
3. Webhook Security
   ✓ Webhook signature verification
   ✓ HTTPS only
   ✓ IP whitelisting (optional)
   
4. Data Encryption
   ✓ HTTPS communication
   ✓ Razorpay PCI DSS compliant
   ✓ No card data stored
   
5. User Authentication
   ✓ JWT token required
   ✓ User-specific orders
   ✓ Secure session management
