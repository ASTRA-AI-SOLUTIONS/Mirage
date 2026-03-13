export interface MediaFrame {
  base64Data: string;
  mimeType: string;
}

// Captures multiple frames from a currently playing video element without seeking
export const captureLiveVideoFrames = async (video: HTMLVideoElement, numFrames = 10, intervalMs = 100): Promise<MediaFrame[]> => {
  const frames: MediaFrame[] = [];
  const canvas = document.createElement('canvas');
  
  // Scale down to max 512px to keep it fast and light for the API
  const width = video.videoWidth || 640;
  const height = video.videoHeight || 480;
  const scale = Math.min(512 / width, 512 / height, 1);
  canvas.width = width * scale;
  canvas.height = height * scale;
  const ctx = canvas.getContext('2d');

  for (let i = 0; i < numFrames; i++) {
    ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
    const base64String = canvas.toDataURL('image/jpeg', 0.7); // 70% quality for speed
    frames.push({
      base64Data: base64String.split(',')[1],
      mimeType: 'image/jpeg'
    });
    
    if (i < numFrames - 1) {
      await new Promise(r => setTimeout(r, intervalMs));
    }
  }
  return frames;
};

// Extracts multiple frames from a video file by seeking through it
export const extractFramesFromVideoFile = async (file: File, numFrames = 10): Promise<MediaFrame[]> => {
  return new Promise((resolve) => {
    const video = document.createElement('video');
    video.src = URL.createObjectURL(file);
    video.muted = true;
    video.playsInline = true;
    video.crossOrigin = 'anonymous';
    const frames: MediaFrame[] = [];

    video.onloadeddata = async () => {
      const duration = video.duration;
      // Extract frames from the middle portion of the video
      const start = duration * 0.1;
      const end = duration * 0.9;
      const interval = (end - start) / Math.max(1, numFrames - 1);
      
      const canvas = document.createElement('canvas');
      const scale = Math.min(512 / video.videoWidth, 512 / video.videoHeight, 1);
      canvas.width = video.videoWidth * scale;
      canvas.height = video.videoHeight * scale;
      const ctx = canvas.getContext('2d');

      for (let i = 0; i < numFrames; i++) {
        video.currentTime = start + (i * interval);
        await new Promise(r => {
          video.onseeked = r;
        });
        ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
        const base64String = canvas.toDataURL('image/jpeg', 0.7);
        frames.push({
          base64Data: base64String.split(',')[1],
          mimeType: 'image/jpeg'
        });
      }
      URL.revokeObjectURL(video.src);
      resolve(frames);
    };
  });
};

// Downscales a single image for faster processing
export const downscaleImage = async (imgSrc: string): Promise<MediaFrame> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const scale = Math.min(512 / img.width, 512 / img.height, 1);
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
      const base64String = canvas.toDataURL('image/jpeg', 0.7);
      resolve({
        base64Data: base64String.split(',')[1],
        mimeType: 'image/jpeg'
      });
    };
    img.onerror = reject;
    img.src = imgSrc;
  });
};
