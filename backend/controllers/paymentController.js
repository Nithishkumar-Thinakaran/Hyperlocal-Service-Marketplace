const Razorpay = require('razorpay');
const crypto = require('crypto');

const razorpay = new Razorpay({
key_id: 'rzp_test_jMKRgDZqovABjo',
key_secret: 'P47p53XFYQO2LoGPiXTO9XgC',
}); 

exports.createOrder = async (req, res) => {
const { amount, currency = 'INR' } = req.body;

try {
const options = {
amount: amount * 100, 
currency,
receipt: 'receipt_order_' + Date.now(),
};
const order = await razorpay.orders.create(options);
res.json(order);
} catch (err) {
console.error('❌ Payment order creation failed:', err);
res.status(500).json({ msg: 'Failed to create Razorpay order', error: err.message });
}
};

exports.verifyPayment = (req, res) => {
const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

const body = razorpay_order_id + "|" + razorpay_payment_id;

const expectedSignature = crypto
.createHmac('sha256', 'P47p53XFYQO2LoGPiXTO9XgC') 
.update(body.toString())
.digest('hex');

if (expectedSignature === razorpay_signature) {
res.status(200).json({ msg: '✅ Payment verified successfully' });
} else {
res.status(400).json({ msg: '❌ Payment verification failed' });
}
};