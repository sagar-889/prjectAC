# UPI Payment Integration Guide

## Overview
This application integrates Razorpay payment gateway with full UPI (Unified Payments Interface) support, allowing customers to pay using various UPI apps like PhonePe, Google Pay, Paytm, and more.

## Features Implemented

### 1. Multiple Payment Methods
- **UPI Payments** (Primary)
  - UPI ID/VPA (e.g., user@paytm)
  - QR Code scanning
  - UPI Intent (direct app opening)
- **Credit/Debit Cards**
- **Net Banking**
- **Digital Wallets**

### 2. UPI Collect Flow
The UPI Collect Flow works as follows:
1. Customer enters their UPI ID or mobile number in the checkout
2. Customer opens their UPI app (PhonePe, GPay, Paytm, etc.)
3. Customer completes 2-factor authentication (UPI PIN + MPIN)
4. Payment is processed and customer is redirected back to the website

### 3. Payment Security
- Razorpay signature verification
- Webhook support for real-time payment updates
- Encrypted payment data
- PCI DSS compliant

## Configuration

### Backend Setup

#### Environment Variables (.env)
```env
DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret
PORT=5000
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret (optional)
```

#### Key Backend Endpoints

1. **Create Order**: `POST /api/orders/create`
   - Creates order in database
   - Generates Razorpay order
   - Returns order details and Razorpay order ID

2. **Verify Payment**: `POST /api/orders/verify-payment`
   - Verifies Razorpay signature
   - Updates order status
   - Confirms payment completion

3. **Webhook Handler**: `POST /api/webhooks/razorpay`
   - Handles payment status updates
   - Processes payment.captured, payment.failed events
   - Updates order status automatically

### Frontend Setup

#### Environment Variables (.env)
```env
VITE_API_URL=http://localhost:5000
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

#### Razorpay Configuration
The payment page includes comprehensive Razorpay configuration:

```javascript
const options = {
  key: RAZORPAY_KEY_ID,
  amount: amount_in_paise,
  currency: "INR",
  name: "Lakshmi Collections",
  order_id: razorpay_order_id,
  method: {
    upi: true,
    card: true,
    netbanking: true,
    wallet: true,
  },
  config: {
    display: {
      blocks: {
        upi: {
          name: 'Pay using UPI',
          instruments: [
            {
              method: 'upi',
              flows: ['collect', 'qr', 'intent']
            }
          ]
        }
      }
    }
  }
};
```

## Testing

### Test Mode
1. Use Razorpay test keys (starts with `rzp_test_`)
2. Test UPI IDs:
   - Success: `success@razorpay`
   - Failure: `failure@razorpay`

### Live Mode
1. Use Razorpay live keys (starts with `rzp_live_`)
2. Complete KYC verification on Razorpay dashboard
3. Enable UPI payment method in Razorpay settings

## Razorpay Dashboard Setup

### 1. Create Account
- Sign up at https://razorpay.com
- Complete KYC verification
- Get API keys from Settings > API Keys

### 2. Enable Payment Methods
- Go to Settings > Payment Methods
- Enable UPI, Cards, Net Banking, Wallets
- Configure payment preferences

### 3. Setup Webhooks (Optional but Recommended)
- Go to Settings > Webhooks
- Add webhook URL: `https://yourdomain.com/api/webhooks/razorpay`
- Select events: `payment.captured`, `payment.failed`, `payment.authorized`
- Copy webhook secret and add to backend .env

### 4. Test Payments
- Use test mode for development
- Test all payment methods
- Verify webhook delivery

## Payment Flow

### 1. Checkout Process
```
Customer adds items to cart
  ↓
Proceeds to checkout
  ↓
Fills shipping information
  ↓
Clicks "Proceed to Payment"
```

### 2. Payment Process
```
Backend creates order
  ↓
Razorpay order generated
  ↓
Payment modal opens
  ↓
Customer selects UPI
  ↓
Enters UPI ID or scans QR
  ↓
Approves in UPI app
  ↓
Payment verified
  ↓
Order status updated
  ↓
Customer redirected to orders page
```

## Error Handling

### Common Errors
1. **Invalid Signature**: Payment verification failed
2. **Payment Cancelled**: User closed payment modal
3. **Payment Failed**: Insufficient balance or declined
4. **Network Error**: Connection issues

### Error Messages
All errors are displayed using toast notifications with appropriate messages.

## Database Schema

### Orders Table
```sql
- id: UUID
- user_id: UUID
- total: DECIMAL
- status: VARCHAR (pending, processing, shipped, delivered, failed)
- razorpay_order_id: VARCHAR
- razorpay_payment_id: VARCHAR
- razorpay_signature: VARCHAR
- shipping_address: JSONB
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

## Security Best Practices

1. **Never expose secret keys** in frontend code
2. **Always verify signatures** on the backend
3. **Use HTTPS** in production
4. **Validate webhook signatures** if using webhooks
5. **Store sensitive data** securely in environment variables
6. **Log payment events** for audit trail

## Support

### Razorpay Documentation
- Main Docs: https://razorpay.com/docs/
- UPI Payments: https://razorpay.com/docs/payments/payment-methods/upi/
- Webhooks: https://razorpay.com/docs/webhooks/

### Contact
For issues or questions:
- Razorpay Support: https://razorpay.com/support/
- Dashboard: https://dashboard.razorpay.com/

## Next Steps

1. **Test thoroughly** in test mode
2. **Complete KYC** on Razorpay
3. **Switch to live keys** when ready
4. **Monitor payments** in Razorpay dashboard
5. **Setup webhooks** for automatic updates
6. **Add payment analytics** for insights

## Additional Features to Consider

1. **Refund Support**: Implement refund API
2. **Payment Links**: Generate payment links for customers
3. **Subscriptions**: Add recurring payment support
4. **EMI Options**: Enable EMI for cards
5. **International Payments**: Support multiple currencies
6. **Payment Analytics**: Track conversion rates
