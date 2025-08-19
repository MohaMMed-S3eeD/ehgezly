"use client";
import React from "react";
import Image from "next/image";

interface Props {
  onUploadComplete: (args: { url: string; publicId?: string }) => void;
  folder?: string;
}

const CloudinaryUploader: React.FC<Props> = ({
  onUploadComplete,
  folder = "app-uploads/services",
}) => {
  const [isUploading, setIsUploading] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [error, setError] = React.useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const inputId = React.useId();

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

    // Prepare preview
    if (previewUrl && previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }
    const nextPreview = URL.createObjectURL(file);
    setPreviewUrl(nextPreview);

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
        xhr.open(
          "POST",
          `https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`
        );
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            setProgress(Math.round((event.loaded / event.total) * 100));
          }
        };
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const data = JSON.parse(xhr.responseText);
              onUploadComplete({
                url: data.secure_url,
                publicId: data.public_id,
              });
              // Prefer the final hosted URL for preview once available
              if (typeof data.secure_url === "string") {
                setPreviewUrl(data.secure_url);
              }
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

  React.useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Image</label>
      <input
        id={inputId}
        type="file"
        accept="image/*"
        onChange={handleChange}
        aria-label="Upload image"
        className="hidden"
      />

      <label
        htmlFor={inputId}
        className="group relative block overflow-hidden rounded-lg border border-dashed border-border bg-muted/20 transition-colors hover:bg-muted/30 cursor-pointer"
      >
        <div className="flex min-h-40 w-full items-center justify-center p-4">
          {previewUrl ? (
            <Image
              src={previewUrl}
              alt="Selected image preview"
              width={800}
              height={320}
              unoptimized
              className="h-40 w-full rounded-md object-cover"
            />
          ) : (
            <div className="flex flex-col items-center gap-1 text-center text-sm text-muted-foreground">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-8 w-8 opacity-70"
              >
                <path d="M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
                <path
                  fillRule="evenodd"
                  d="M4.5 5.25A2.25 2.25 0 0 1 6.75 3h10.5A2.25 2.25 0 0 1 19.5 5.25v13.5A2.25 2.25 0 0 1 17.25 21H6.75A2.25 2.25 0 0 1 4.5 18.75V5.25Zm3 3A.75.75 0 0 1 8.25 7.5h7.5a.75.75 0 0 1 0 1.5h-7.5a.75.75 0 0 1-.75-.75Z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="font-medium text-foreground/80">Click to upload</span>
              <span className="text-xs">PNG, JPG up to 5MB</span>
            </div>
          )}
        </div>

        {isUploading ? (
          <div className="absolute bottom-0 left-0 right-0">
            <progress
              value={progress}
              max={100}
              className="h-1 w-full [&::-webkit-progress-bar]:bg-muted [&::-webkit-progress-value]:bg-primary [&::-moz-progress-bar]:bg-primary"
              aria-label="Upload progress"
            />
            <div className="px-3 py-2 text-right text-xs text-muted-foreground">
              Uploading... {progress}%
            </div>
          </div>
        ) : null}
      </label>

      {error ? <div className="text-xs text-red-500">{error}</div> : null}
    </div>
  );
};

export default CloudinaryUploader;
