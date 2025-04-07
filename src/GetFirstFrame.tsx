import { useState } from "react";

export function useFirstVideoFrame() {
	const [imageSrc, setImageSrc] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [videoSize, setVideoSize] = useState<{
		width: number;
		height: number;
	} | null>(null);

	const extractFirstFrame = async (file: File | Blob) => {
		setLoading(true);
		setError(null);
		setImageSrc(null);

		try {
			const base64 = await new Promise<string>((resolve, reject) => {
				const video = document.createElement("video");
				const canvas = document.createElement("canvas");
				const url = URL.createObjectURL(file);

				video.preload = "metadata";
				video.src = url;
				video.muted = true;
				video.playsInline = true;

				video.addEventListener("loadeddata", () => {
					video.currentTime = 0;
					setVideoSize({ width: video.videoWidth, height: video.videoHeight });
				});

				video.addEventListener("seeked", () => {
					canvas.width = video.videoWidth;
					canvas.height = video.videoHeight;
					const ctx = canvas.getContext("2d");

					if (!ctx) {
						reject("Could not get canvas context");
						return;
					}

					ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
					URL.revokeObjectURL(url);
					resolve(canvas.toDataURL("image/png"));
				});

				video.addEventListener("error", (err) => {
					reject(`Error loading video: ${err}`);
				});
			});

			setImageSrc(base64);
		} catch (err: any) {
			setError(err.toString());
		} finally {
			setLoading(false);
		}
	};

	return { imageSrc, loading, error, extractFirstFrame };
}
