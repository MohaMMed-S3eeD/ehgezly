import cloudinary from "@/lib/cloudinary";

export async function POST(req: Request) {
	const { folder = "app-uploads/services", public_id, upload_preset } = await req.json();
	const timestamp = Math.floor(Date.now() / 1000);
	const paramsToSign: Record<string, string | number | undefined> = {
		timestamp,
		folder,
		public_id,
		...(upload_preset ? { upload_preset } : {}),
	};
	const signature = (cloudinary.utils as unknown as { api_sign_request: (params: Record<string, unknown>, secret: string) => string })
		.api_sign_request(paramsToSign as Record<string, unknown>, process.env.CLOUDINARY_API_SECRET as string);
	return Response.json({
		timestamp,
		signature,
		cloudName: process.env.CLOUDINARY_CLOUD_NAME,
		apiKey: process.env.CLOUDINARY_API_KEY,
		uploadPreset: upload_preset,
		folder,
	});
}


