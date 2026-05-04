const { createClient } = require("@supabase/supabase-js");
exports.handler = async function(event){
  if(event.httpMethod !== "GET") return {statusCode:405,body:JSON.stringify({error:"Method not allowed"})};
  try{
    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
    const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending:false });
    if(error) return {statusCode:500,body:JSON.stringify({error:error.message})};
    return {statusCode:200,body:JSON.stringify(data)};
  }catch(err){ console.error("get-orders error:",err); return {statusCode:500,body:JSON.stringify({error:"Could not load orders"})}; }
};
