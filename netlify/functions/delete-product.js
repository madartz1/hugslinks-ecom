const { createClient } = require("@supabase/supabase-js");
exports.handler = async function(event){
  if(event.httpMethod !== "POST") return {statusCode:405,body:JSON.stringify({error:"Method not allowed"})};
  try{const supabase=createClient(process.env.SUPABASE_URL,process.env.SUPABASE_SERVICE_KEY);const body=JSON.parse(event.body||"{}");if(!body.id)return{statusCode:400,body:JSON.stringify({error:"Missing product ID"})};const{error}=await supabase.from("products").delete().eq("id",body.id);if(error)return{statusCode:500,body:JSON.stringify({error:error.message})};return{statusCode:200,body:JSON.stringify({success:true})};}catch(err){console.error("Delete product error:",err);return{statusCode:500,body:JSON.stringify({error:"Could not delete product"})};}
};
