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
    const fileName = formData.get('fileName') as string || 'file';
    const workspaceId = formData.get('workspaceId') as string || 'general';
    const uploadType = formData.get('uploadType') as string || 'auto';

    if (!file) {
      throw new Error('No file provided');
    }

    console.log(`Uploading file: ${file.name}, size: ${file.size}, type: ${file.type}, uploadType: ${uploadType}`);

    // Determine resource type based on file type
    let resourceType = uploadType;
    if (uploadType === 'auto') {
      if (file.type.startsWith('image/')) {
        resourceType = 'image';
      } else if (file.type.startsWith('video/') || file.type.startsWith('audio/')) {
        resourceType = 'video';
      } else {
        resourceType = 'raw';
      }
    }

    // Convert file to base64 using chunked approach to avoid stack overflow
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    
    // Convert to base64 in chunks to avoid stack overflow for large files
    let base64 = '';
    const chunkSize = 32768; // 32KB chunks
    for (let i = 0; i < uint8Array.length; i += chunkSize) {
      const chunk = uint8Array.slice(i, i + chunkSize);
      base64 += String.fromCharCode(...chunk);
    }
    base64 = btoa(base64);
    
    const dataUri = `data:${file.type};base64,${base64}`;

    // Generate timestamp and signature for Cloudinary upload
    const timestamp = Math.floor(Date.now() / 1000);
    const folder = `workspace-files/${workspaceId}`;
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '-').replace(/\s+/g, '-');
    const publicId = `${sanitizedFileName}-${timestamp}`;
    
    // Create signature - parameters must be in alphabetical order
    // IMPORTANT: Only include parameters that will be sent in the request
    const signatureString = `folder=${folder}&public_id=${publicId}&timestamp=${timestamp}${CLOUDINARY_API_SECRET}`;
    
    const encoder = new TextEncoder();
    const data = encoder.encode(signatureString);
    const hashBuffer = await crypto.subtle.digest('SHA-1', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const signature = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    console.log(`Uploading to Cloudinary - folder: ${folder}, publicId: ${publicId}, resourceType: ${resourceType}`);

    // Build Cloudinary form data - only include signed parameters
    const cloudinaryFormData = new FormData();
    cloudinaryFormData.append('file', dataUri);
    cloudinaryFormData.append('api_key', CLOUDINARY_API_KEY);
    cloudinaryFormData.append('timestamp', timestamp.toString());
    cloudinaryFormData.append('signature', signature);
    cloudinaryFormData.append('folder', folder);
    cloudinaryFormData.append('public_id', publicId);

    // Set upload endpoint
    const uploadUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`;

    const uploadResponse = await fetch(uploadUrl, {
      method: 'POST',
      body: cloudinaryFormData,
    });

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
        format: uploadResult.format,
        bytes: uploadResult.bytes,
        resourceType: uploadResult.resource_type,
        width: uploadResult.width,
        height: uploadResult.height,
        duration: uploadResult.duration,
        optimizedUrl: uploadResult.secure_url,
        originalFileName: file.name,
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
