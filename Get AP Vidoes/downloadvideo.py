import os
import json
import requests

output_folder = "AP Macroeconomics"
try:
    os.mkdir(output_folder)
except OSError:
    pass

data = json.load(open('classroom_data.json'))

last_chapter = ""
num_videos = 1

for unit in data:
    try:
        os.mkdir(f"{output_folder}/{unit}")
    except OSError:
        pass

    for video in data[unit]:
        print(f"{unit} {video[1]}")

        current_chapter = video[1]

        video_url = requests.get(f'https://fast.wistia.com/embed/medias/{video[0]}.json').json()['media']["assets"][2]['url']
        video_data = requests.get(video_url)

        if current_chapter == last_chapter:
            num_videos += 1
        else:
            num_videos = 1

        last_chapter = current_chapter

        with open(f"{output_folder}/{unit}/{current_chapter} Video {num_videos}.mp4", "wb") as f:
            f.write(video_data.content)
