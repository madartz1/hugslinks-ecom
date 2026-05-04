const Stripe = require("stripe");
const { createClient } = require("@supabase/supabase-js");
exports.handler = async function(event){
  if(event.httpMethod !== "POST") return {statusCode:405,body:"Method not allowed"};
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
  const signature = event.headers["stripe-signature"];
  let stripeEvent;
  try{ stripeEvent = stripe.webhooks.constructEvent(event.body, signature, process.env.STRIPE_WEBHOOK_SECRET); }
  catch(err){ console.error("Webhook signature error:", err.message); return {statusCode:400,body:`Webhook Error: ${err.message}`}; }
  if(stripeEvent.type === "checkout.session.completed"){
    const session = stripeEvent.data.object;
    const order = {id:session.id,email:session.customer_details?.email || null,amount:session.amount_total || 0,status:"paid"};
    const { error } = await supabase.from("orders").upsert([order]);
    if(error){ console.error("Supabase order save error:", error.message); return {statusCode:500,body:JSON.stringify({error:"Order save failed"})}; }
  }
  return {statusCode:200,body:JSON.stringify({received:true})};
};
