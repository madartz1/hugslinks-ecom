const Busboy = require("busboy");
const { createClient } = require("@supabase/supabase-js");

function parseMultipart(event){
  return new Promise((resolve, reject) => {
    const busboy = Busboy({ headers: event.headers });
    let upload = null;
    busboy.on("file", (fieldname, file, info) => {
      const chunks = [];
      file.on("data", data => chunks.push(data));
      file.on("end", () => {
        upload = { filename: info.filename, mimeType: info.mimeType, buffer: Buffer.concat(chunks) };
      });
    });
    busboy.on("error", reject);
    busboy.on("finish", () => resolve(upload));
    busboy.end(Buffer.from(event.body, event.isBase64Encoded ? "base64" : "binary"));
  });
}

exports.handler = async function(event){
  if(event.httpMethod !== "POST") return { statusCode:405, body:JSON.stringify({error:"Method not allowed"}) };
  try{
    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
    const file = await parseMultipart(event);
    if(!file) return { statusCode:400, body:JSON.stringify({error:"No image uploaded"}) };
    const safeName = `${Date.now()}-${file.filename}`.replace(/[^a-zA-Z0-9._-]/g, "-");
    const { error } = await supabase.storage.from("product-images").upload(safeName, file.buffer, { contentType:file.mimeType, upsert:false });
    if(error) return { statusCode:500, body:JSON.stringify({error:error.message}) };
    const { data } = supabase.storage.from("product-images").getPublicUrl(safeName);
    return { statusCode:200, body:JSON.stringify({ url:data.publicUrl }) };
  }catch(err){ console.error("Upload error:", err); return { statusCode:500, body:JSON.stringify({error:"Upload failed"}) }; }
};
