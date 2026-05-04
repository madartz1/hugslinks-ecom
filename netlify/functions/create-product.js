const { createClient } = require("@supabase/supabase-js");
exports.handler = async function(event){
  if(event.httpMethod !== "POST") return {statusCode:405,body:JSON.stringify({error:"Method not allowed"})};
  try{const supabase=createClient(process.env.SUPABASE_URL,process.env.SUPABASE_SERVICE_KEY);const body=JSON.parse(event.body||"{}");if(!body.name||!body.price)return{statusCode:400,body:JSON.stringify({error:"Missing required fields"})};const product={id:body.id||Date.now().toString(),name:body.name,price:Number(body.price),image:body.image||"",description:body.description||"",stock:Number(body.stock||0),active:body.active!==false};const{data,error}=await supabase.from("products").insert([product]).select();if(error)return{statusCode:500,body:JSON.stringify({error:error.message})};return{statusCode:200,body:JSON.stringify(data[0])};}catch(err){console.error("Create product error:",err);return{statusCode:500,body:JSON.stringify({error:"Could not create product"})};}
};
