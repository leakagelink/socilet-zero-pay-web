import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const CLOUDINARY_CLOUD_NAME = Deno.env.get('CLOUDINARY_CLOUD_NAME');
    const CLOUDINARY_API_KEY = Deno.env.get('CLOUDINARY_API_KEY');
    const CLOUDINARY_API_SECRET = Deno.env.get('CLOUDINARY_API_SECRET');

    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
      console.error('Missing Cloudinary credentials');
      throw new Error('Cloudinary credentials not configured');
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;
    const meetingTitle = formData.get('meetingTitle') as string || 'recording';
    const workspaceId = formData.get('workspaceId') as string || 'unknown';

    if (!file) {
      throw new Error('No file provided');
    }

    console.log(`Uploading file: ${file.name}, size: ${file.size}, type: ${file.type}`);

    // Convert file to base64
    const arrayBuffer = await file.arrayBuffer();
    const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
    const dataUri = `data:${file.type};base64,${base64}`;

    // Generate timestamp and signature for Cloudinary upload
    const timestamp = Math.floor(Date.now() / 1000);
    const folder = `meeting-recordings/${workspaceId}`;
    const publicId = `${meetingTitle.replace(/\s+/g, '-')}-${timestamp}`;
    
    // Create signature
    const signatureString = `folder=${folder}&public_id=${publicId}&timestamp=${timestamp}${CLOUDINARY_API_SECRET}`;
    const encoder = new TextEncoder();
    const data = encoder.encode(signatureString);
    const hashBuffer = await crypto.subtle.digest('SHA-1', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const signature = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    console.log(`Uploading to Cloudinary folder: ${folder}, publicId: ${publicId}`);

    // Upload to Cloudinary
    const cloudinaryFormData = new FormData();
    cloudinaryFormData.append('file', dataUri);
    cloudinaryFormData.append('api_key', CLOUDINARY_API_KEY);
    cloudinaryFormData.append('timestamp', timestamp.toString());
    cloudinaryFormData.append('signature', signature);
    cloudinaryFormData.append('folder', folder);
    cloudinaryFormData.append('public_id', publicId);
    cloudinaryFormData.append('resource_type', 'video');
    // Enable auto-compression and optimization
    cloudinaryFormData.append('eager', 'f_auto,q_auto,c_limit,w_1280');

    const uploadResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/video/upload`,
      {
        method: 'POST',
        body: cloudinaryFormData,
      }
    );

    const uploadResult = await uploadResponse.json();

    if (!uploadResponse.ok) {
      console.error('Cloudinary upload failed:', uploadResult);
      throw new Error(uploadResult.error?.message || 'Upload failed');
    }

    console.log('Upload successful:', uploadResult.secure_url);

    return new Response(
      JSON.stringify({
        success: true,
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id,
        duration: uploadResult.duration,
        format: uploadResult.format,
        bytes: uploadResult.bytes,
        optimizedUrl: uploadResult.eager?.[0]?.secure_url || uploadResult.secure_url,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('Error in cloudinary-upload:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
