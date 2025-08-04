import requests

def download_video(video_url):
    local_filename = 'temp_video.mp4'
    with requests.get(video_url, stream=True) as r:
        r.raise_for_status()
        content_type = r.headers.get('Content-Type', '')
        if not (content_type.startswith('video/') or content_type == 'application/mp4'):
            raise ValueError(f"URL does not point to a video file. Content-Type: {content_type}")
        with open(local_filename, 'wb') as f:
            for chunk in r.iter_content(chunk_size=8192):
                f.write(chunk)
    # Check file size
    import os
    if not os.path.exists(local_filename) or os.path.getsize(local_filename) < 1024:
        raise ValueError("Downloaded file is missing or too small to be a valid video.")
    return local_filename
