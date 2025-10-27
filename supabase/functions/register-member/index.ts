import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

// We are using [V5] so we know this new code is running
console.log('Function booting up... [V5 FINAL TEST]'); 

Deno.serve(async (req) => {
  console.log('[V5] Request received:', req.method);

  if (req.method === 'OPTIONS') {
    console.log('[V5] Handling OPTIONS request');
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    console.log('[V5] Entering TRY block...');
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );
    console.log('[V5] Admin client created.');

    const body = await req.json();
    console.log('[V5] Request body parsed:', body);

    const { email, password, name, roles } = body;
    console.log(`[V5] Data: email=${email}, name=${name}, roles=${JSON.stringify(roles)}`);

    console.log('[V5] Creating auth user...');
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true,
    });

    if (authError) {
      console.error('[V5] Auth Error:', authError.message);
      throw authError;
    }
    console.log('[V5] Auth user created:', authData.user.id);

    const insertData = {
      uid: authData.user.id,
      name: name,
      email: email,
      role: roles 
    };
    console.log('[V5] Inserting into "users" table with data:', JSON.stringify(insertData));
    
    const { error: profileError } = await supabaseAdmin
      .from('users')
      .insert(insertData); 

    if (profileError) {
      console.error('[V5] Profile/Insert Error:', profileError.message);
      throw profileError;
    }
    console.log('[V5] Insert successful.');

    return new Response(JSON.stringify({ success: true, user: authData.user }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    const errorMessage = (error as any).message; 
    console.error('[V5] FUNCTION FAILED (in catch block):', errorMessage); 
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})