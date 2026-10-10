import cv2
import numpy as np
import math
import os

poster_path = r"frontend/public/posters/salon-hero-poster.jpg"
output_video_path = r"frontend/public/videos/salon-hero.mp4"

if not os.path.exists(poster_path):
    print(f"Error: {poster_path} not found")
    exit(1)

img = cv2.imread(poster_path)
h, w, c = img.shape
target_w, target_h = 1280, 720

fps = 30
duration_sec = 8
total_frames = fps * duration_sec

# VideoWriter with standard MP4V / avc1 codec
fourcc = cv2.VideoWriter_fourcc(*'mp4v')
out = cv2.VideoWriter(output_video_path, fourcc, fps, (target_w, target_h))

print(f"Generating cinematic 3D camera hero video ({total_frames} frames)...")

for frame_idx in range(total_frames):
    # Sinusoidal camera motion factor [0, 1]
    t = frame_idx / total_frames
    phase = math.sin(t * 2 * math.pi)  # Loops back seamlessly to 0
    
    # Subtle cinematic zoom: 1.0 to 1.06
    zoom = 1.0 + 0.05 * (0.5 + 0.5 * phase)
    
    # Subtle horizontal pan: +/- 25 pixels
    pan_x = int(25 * phase)
    # Subtle vertical drift: +/- 10 pixels
    pan_y = int(10 * math.cos(t * 2 * math.pi))
    
    # Calculate crop box
    crop_w = int(w / zoom)
    crop_h = int(h / zoom)
    
    x_start = max(0, min(w - crop_w, (w - crop_w) // 2 + pan_x))
    y_start = max(0, min(h - crop_h, (h - crop_h) // 2 + pan_y))
    
    cropped = img[y_start:y_start+crop_h, x_start:x_start+crop_w]
    resized = cv2.resize(cropped, (target_w, target_h), interpolation=cv2.INTER_LINEAR)
    
    # Subtle ambient lighting glow pulsation on highlights
    glow_factor = 1.0 + 0.03 * math.sin(t * 4 * math.pi)
    frame = np.clip(resized.astype(np.float32) * glow_factor, 0, 255).astype(np.uint8)
    
    out.write(frame)

out.release()
print(f"Hero video successfully created at {output_video_path}")
