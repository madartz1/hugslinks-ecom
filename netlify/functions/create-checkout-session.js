const Stripe = require("stripe");
exports.handler = async function(event){
  if(event.httpMethod !== "POST") return {statusCode:405,body:JSON.stringify({error:"Method not allowed"})};
  try{
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const { cart } = JSON.parse(event.body || "{}");
    if(!cart || !Array.isArray(cart) || cart.length===0) return {statusCode:400,body:JSON.stringify({error:"Cart is empty"})};
    const line_items = cart.map(item=>({price_data:{currency:"usd",product_data:{name:item.name,images:item.image?[item.image]:[]},unit_amount:Math.round(Number(item.price)*100)},quantity:Number(item.quantity||1)}));
    const siteUrl = process.env.URL || process.env.DEPLOY_PRIME_URL || "http://localhost:8888";
    const session = await stripe.checkout.sessions.create({mode:"payment",line_items,shipping_address_collection:{allowed_countries:["US"]},metadata:{source:"HUGS_STORE",cart:JSON.stringify(cart.map(i=>({id:i.id,name:i.name,quantity:i.quantity,price:i.price})))},success_url:`${siteUrl}/success.html`,cancel_url:`${siteUrl}/shop.html`});
    return {statusCode:200,body:JSON.stringify({url:session.url})};
  }catch(err){console.error("Stripe checkout error:",err);return {statusCode:500,body:JSON.stringify({error:"Checkout session failed"})};}
};
