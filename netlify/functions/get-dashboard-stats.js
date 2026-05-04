const { createClient } = require("@supabase/supabase-js");
exports.handler = async function(event){
  if(event.httpMethod !== "GET") return {statusCode:405,body:JSON.stringify({error:"Method not allowed"})};
  try{const supabase=createClient(process.env.SUPABASE_URL,process.env.SUPABASE_SERVICE_KEY);const{data:orders,error:orderError}=await supabase.from("orders").select("*");if(orderError)throw new Error(orderError.message);const{data:products,error:productError}=await supabase.from("products").select("*");if(productError)throw new Error(productError.message);const revenue=(orders||[]).reduce((sum,o)=>sum+Number(o.amount||0),0);const lowStock=(products||[]).filter(p=>Number(p.stock||0)<=5).length;return{statusCode:200,body:JSON.stringify({revenue,orders:(orders||[]).length,products:(products||[]).length,lowStock})};}catch(err){console.error("Dashboard stats error:",err);return{statusCode:500,body:JSON.stringify({error:"Could not load dashboard stats"})};}
};
