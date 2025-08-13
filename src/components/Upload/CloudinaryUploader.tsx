"use client";
import React from "react";

interface Props {
	onUploadComplete: (args: { url: string; publicId?: string }) => void;
	folder?: string;
}

const CloudinaryUploader: React.FC<Props> = ({ onUploadComplete, folder = "app-uploads/services" }) => {
	const [isUploading, setIsUploading] = React.useState(false);
	const [progress, setProgress] = React.useState(0);
	const [error, setError] = React.useState<string | null>(null);

	const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;
		setError(null);
		if (!file.type.startsWith("image/")) {
			setError("Please select a valid image file");
			return;
		}
		if (file.size > 5 * 1024 * 1024) {
			setError("Image is too large (max 5MB)");
			return;
		}

		setIsUploading(true);
		setProgress(0);
		try {
			const sigRes = await fetch("/api/cloudinary/sign", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ folder }),
			});
			if (!sigRes.ok) throw new Error("Failed to get signature");
			const sig = await sigRes.json();

			const form = new FormData();
			form.append("file", file);
			form.append("api_key", sig.apiKey);
			form.append("timestamp", String(sig.timestamp));
			form.append("signature", sig.signature);
			if (sig.uploadPreset) form.append("upload_preset", sig.uploadPreset);
			form.append("folder", sig.folder || folder);

			await new Promise<void>((resolve, reject) => {
				const xhr = new XMLHttpRequest();
				xhr.open("POST", `https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`);
				xhr.upload.onprogress = (event) => {
					if (event.lengthComputable) {
						setProgress(Math.round((event.loaded / event.total) * 100));
					}
				};
				xhr.onload = () => {
					if (xhr.status >= 200 && xhr.status < 300) {
						try {
							const data = JSON.parse(xhr.responseText);
							onUploadComplete({ url: data.secure_url, publicId: data.public_id });
							resolve();
						} catch (e) {
							reject(e);
						}
					} else {
						reject(new Error("Upload failed"));
					}
				};
				xhr.onerror = () => reject(new Error("Network error"));
				xhr.send(form);
			});
		} catch (e) {
			const message = e instanceof Error ? e.message : "Upload failed";
			setError(message);
		} finally {
			setIsUploading(false);
		}
	};

	return (
		<div className="space-y-2">
			<label className="text-sm font-medium">Image</label>
			<input type="file" accept="image/*" onChange={handleChange} aria-label="Upload image" />
			{isUploading ? (
				<div className="text-xs text-muted-foreground">Uploading... {progress}%</div>
			) : null}
			{error ? <div className="text-xs text-red-500">{error}</div> : null}
		</div>
	);
};

export default CloudinaryUploader;


