# Quick Setup Guide - UPI Payment Integration

## ✅ What's Already Done

Your application already has Razorpay integrated! I've enhanced it with:

1. **Full UPI Support** with multiple payment flows:
   - UPI ID/VPA entry (e.g., user@paytm)
   - QR Code scanning
   - Direct UPI app intent

2. **Enhanced Payment UI** showing all payment methods:
   - UPI (PhonePe, GPay, Paytm)
   - Credit/Debit Cards
   - Net Banking
   - Digital Wallets

3. **Webhook Support** for automatic payment status updates

4. **Improved Security** with signature verification

## 🚀 Quick Start

### 1. Backend is Ready
Your backend already has:
- ✅ Razorpay SDK installed
- ✅ Order creation endpoint
- ✅ Payment verification endpoint
- ✅ Webhook handler (NEW)
- ✅ Environment variables configured

### 2. Frontend is Ready
Your frontend already has:
- ✅ Razorpay checkout integration
- ✅ Enhanced UPI configuration (UPDATED)
- ✅ Payment method display (NEW)
- ✅ User-friendly payment flow

### 3. Test the Integration

#### Start the Application
```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend
cd frontend
npm run dev
```

#### Test Payment Flow
1. Add items to cart
2. Go to checkout
3. Fill shipping information
4. Click "Proceed to Payment"
5. Click "Pay" button
6. Select UPI payment method
7. Use test UPI ID: `success@razorpay` (in test mode)

## 🔧 Configuration Checklist

### Razorpay Dashboard Setup

1. **Get API Keys**
   - Login to https://dashboard.razorpay.com
   - Go to Settings > API Keys
   - Copy Key ID and Key Secret
   - Already configured in your .env files ✅

2. **Enable Payment Methods**
   - Go to Settings > Payment Methods
   - Enable: UPI, Cards, Net Banking, Wallets
   - Save changes

3. **Setup Webhooks (Recommended)**
   - Go to Settings > Webhooks
   - Click "Add New Webhook"
   - URL: `https://your-domain.com/api/webhooks/razorpay`
   - Events: Select `payment.captured`, `payment.failed`, `payment.authorized`
   - Copy the webhook secret
   - Add to backend/.env: `RAZORPAY_WEBHOOK_SECRET=your_secret`

4. **Test Mode vs Live Mode**
   - Currently using: **Live Keys** (rzp_live_*)
   - For testing, switch to test keys (rzp_test_*)
   - Test UPI IDs:
     - Success: `success@razorpay`
     - Failure: `failure@razorpay`

## 📱 UPI Payment Flow

### How Customers Will Pay

1. **On Payment Page**
   - Customer sees total amount
   - Clicks "Pay ₹XXX" button
   - Razorpay modal opens

2. **Select UPI**
   - Customer clicks on "UPI" option
   - Three ways to pay:
     - **Enter UPI ID**: Type their UPI ID (e.g., 9876543210@paytm)
     - **Scan QR Code**: Use any UPI app to scan
     - **Select UPI App**: Direct link to PhonePe, GPay, etc.

3. **Complete Payment**
   - Customer opens their UPI app
   - Enters UPI PIN
   - Payment is processed
   - Redirected back to your website

4. **Order Confirmation**
   - Payment verified automatically
   - Order status updated to "Processing"
   - Customer sees success message
   - Redirected to orders page

## 🔒 Security Features

- ✅ Signature verification on all payments
- ✅ Webhook signature validation
- ✅ Encrypted payment data
- ✅ Secure HTTPS communication
- ✅ No sensitive data in frontend

## 📊 Monitor Payments

### Razorpay Dashboard
- View all transactions
- Check payment status
- Download reports
- Manage refunds
- View analytics

### Your Application
- Orders page shows all orders
- Admin panel for order management
- Payment status tracking
- Order history for customers

## 🐛 Troubleshooting

### Payment Modal Not Opening
- Check if Razorpay script is loaded
- Verify RAZORPAY_KEY_ID in frontend/.env
- Check browser console for errors

### Payment Verification Failed
- Verify RAZORPAY_KEY_SECRET in backend/.env
- Check signature verification logic
- Review backend logs

### Webhook Not Working
- Verify webhook URL is accessible
- Check webhook secret configuration
- Review webhook logs in Razorpay dashboard

## 📝 Testing Checklist

- [ ] Backend server running
- [ ] Frontend server running
- [ ] Can add items to cart
- [ ] Can proceed to checkout
- [ ] Can fill shipping information
- [ ] Payment modal opens
- [ ] Can see UPI option
- [ ] Can enter UPI ID
- [ ] Payment processes successfully
- [ ] Order status updates
- [ ] Redirected to orders page
- [ ] Order appears in orders list

## 🎯 Next Steps

1. **Test in Test Mode**
   - Switch to test keys
   - Test all payment methods
   - Test failure scenarios

2. **Complete KYC**
   - Required for live payments
   - Submit documents on Razorpay dashboard
   - Wait for approval (usually 24-48 hours)

3. **Go Live**
   - Switch to live keys
   - Test with small amount
   - Monitor first few transactions

4. **Setup Webhooks**
   - Add webhook URL
   - Configure webhook secret
   - Test webhook delivery

5. **Monitor & Optimize**
   - Track conversion rates
   - Monitor failed payments
   - Optimize checkout flow
   - Add analytics

## 📞 Support

- **Razorpay Docs**: https://razorpay.com/docs/
- **UPI Guide**: https://razorpay.com/docs/payments/payment-methods/upi/
- **Support**: https://razorpay.com/support/

## 🎉 You're All Set!

Your UPI payment integration is complete and ready to use. Just test it thoroughly and you're good to go live!
