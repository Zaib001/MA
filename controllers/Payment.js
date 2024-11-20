const stripe = require("stripe")(
  "pk_live_51OwdyyF1GyAmh9XjXFM7JZ6g1EllJcc75xx0vcSUM5FslWxWeO9kxYpOfFELhw1usLytY6y02MU5SObFoFhay4dA00R5N6tRkS"
);

exports.paymentController = async (req, res) => {
  const { amount } = req.body;

  if (!amount) {
    return res.status(400).send({ error: "Amount is required" });
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: "usd",
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};
