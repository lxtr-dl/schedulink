import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  };
}

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders() });
  }

  try {
    const { email, password, name, role } = await req.json();

    if (!email || !password || !name || !role) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: corsHeaders()
      });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SERVICE_ROLE_KEY')! // Make sure your secret is named this
    );

    const { data: user, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true
    });

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: corsHeaders()
      });
    }

    const { error: dbError } = await supabase.from('users').insert({
      uid: user.user.id,
      email,
      name,
      role
    });

    if (dbError) {
      return new Response(JSON.stringify({ error: dbError.message }), {
        status: 500,
        headers: corsHeaders()
      });
    }

    return new Response(JSON.stringify({ message: 'User created successfully' }), {
      status: 200,
      headers: corsHeaders()
    });

  } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Server error';
      return new Response(JSON.stringify({ error: message }), {
        status: 500,
        headers: corsHeaders()
      });
    }
});
