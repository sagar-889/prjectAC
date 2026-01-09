# Razorpay Payment Setup Guide

## Why UPI is Not Showing

If UPI is not appearing in your payment options, it's because **UPI must be explicitly activated in your Razorpay Dashboard for live mode**.

## Steps to Enable UPI

### 1. Login to Razorpay Dashboard
Go to [https://dashboard.razorpay.com/](https://dashboard.razorpay.com/)

### 2. Navigate to Payment Methods
- Click on **Settings** in the left sidebar
- Select **Payment Methods**

### 3. Activate UPI
- Find **UPI** in the list of payment methods
- Click **Activate** or **Enable**
- Complete any required verification steps
- Submit business documents if requested

### 4. Wait for Activation
- Activation typically takes 5-10 minutes
- For some accounts, it may require manual approval (1-2 business days)
- You'll receive an email confirmation once activated

## Test Mode vs Live Mode

### Test Mode (Recommended for Development)
- **Keys start with:** `rzp_test_`
- **All payment methods are available** by default
- No activation required
- Use test cards/UPI IDs for testing

### Live Mode (For Production)
- **Keys start with:** `rzp_live_`
- **Payment methods must be activated** individually
- Requires KYC verification
- Real money transactions

## Current Configuration

Your current keys in `.env`:
```
VITE_RAZORPAY_KEY_ID=rzp_live_S0G5P2XmFQpsQ2
```

This is a **live key**, so you need to:
1. Complete KYC verification
2. Activate UPI in dashboard
3. Wait for approval

## Quick Test with Test Keys

To test immediately, switch to test mode:

1. Go to Dashboard → Settings → API Keys
2. Switch to **Test Mode**
3. Copy the test Key ID and Key Secret
4. Update your `.env` files:

**Frontend (.env):**
```
VITE_RAZORPAY_KEY_ID=rzp_test_YOUR_TEST_KEY
```

**Backend (.env):**
```
RAZORPAY_KEY_ID=rzp_test_YOUR_TEST_KEY
RAZORPAY_KEY_SECRET=YOUR_TEST_SECRET
```

5. Restart both frontend and backend
6. Deploy to Vercel and Render

## Test UPI IDs

When using test mode, use these test UPI IDs:
- **Success:** `success@razorpay`
- **Failure:** `failure@razorpay`

## Verifying Activation

After activation, you should see:
- ✅ UPI option in payment modal
- ✅ PhonePe, Google Pay, Paytm logos
- ✅ "Enter UPI ID" or "Scan QR" options

## Troubleshooting

### UPI Still Not Showing?
1. Clear browser cache
2. Check Razorpay Dashboard → Payment Methods → UPI status
3. Verify you're using the correct API keys
4. Check if your account is fully activated (not in restricted mode)

### Account Restricted?
- Complete KYC verification
- Submit required business documents
- Contact Razorpay support: support@razorpay.com

## Support

- **Razorpay Support:** support@razorpay.com
- **Documentation:** https://razorpay.com/docs/
- **Dashboard:** https://dashboard.razorpay.com/

## Payment Methods Available

Once activated, your customers can pay using:
- 💳 Credit/Debit Cards (Visa, Mastercard, RuPay, Amex)
- 📱 UPI (PhonePe, Google Pay, Paytm, BHIM)
- 🏦 Net Banking (All major banks)
- 💰 Wallets (Paytm, PhonePe, Mobikwik, etc.)
- 💵 EMI options (for eligible cards)

## Important Notes

1. **Live mode requires business verification** - Have your business documents ready
2. **UPI activation is mandatory** - It's not enabled by default in live mode
3. **Test mode is instant** - Use it for development and testing
4. **Switch to live mode only when ready** - After completing all verifications
