import requests

def download_video(video_url):
    local_filename = 'temp_video.mp4'
    with requests.get(video_url, stream=True) as r:
        r.raise_for_status()
        with open(local_filename, 'wb') as f:
            for chunk in r.iter_content(chunk_size=8192):
                f.write(chunk)
    return local_filename
