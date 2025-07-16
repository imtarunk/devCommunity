// supabase/functions/get-user/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
// Replace with your Supabase project URL and anon key
const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const supabase = createClient(supabaseUrl, supabaseKey);
// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};
serve(async (req) => {
  // Handle preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders,
    });
  }
  try {
    const url = new URL(req.url);
    const userId = url.pathname.split("/").pop(); // Get userId from URL
    if (!userId) {
      return new Response(
        JSON.stringify({
          error: "User ID not provided",
        }),
        {
          status: 400,
          headers: corsHeaders,
        }
      );
    }
    // Query the accounts table
    const { data, error } = await supabase
      .from("accounts")
      .select("*")
      .eq("id", userId)
      .single(); // Because we expect only one row
    if (error) {
      return new Response(
        JSON.stringify({
          error: error.message,
        }),
        {
          status: 500,
          headers: corsHeaders,
        }
      );
    }
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({
        error: "Server Error",
      }),
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }
});
//vs-code
