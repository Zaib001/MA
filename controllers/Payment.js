const stripe = require("stripe")(
  "sk_test_51OKlibFTBEHW1myd4lyUjD2gNh9QwoPctXRSZVNWLnUphm0BOWAV6Hpz8hHiM2WkZ6tjpRQbT66EmwXfDmEhGSph00Crkio1RV"
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
