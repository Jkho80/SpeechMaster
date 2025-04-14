import requests
import time
import random
import csv
from bs4 import BeautifulSoup


def get_audio_url(img_id, headers):
    base_audio_url = "https://so.gushiwen.cn/viewplay.aspx"
    if img_id.startswith("speakerimg"):
        poem_id = img_id.replace("speakerimg", "")
    else:
        poem_id = img_id
    params = {"id": poem_id}

    try:
        audio_resp = requests.get(base_audio_url, headers=headers, params=params, timeout=10)
        if audio_resp.status_code == 200:
            data = audio_resp.json()  # parse JSON
            return data.get("langsongUrl")
        else:
            print(f"[WARNING] Audio request returned status {audio_resp.status_code}")
    except Exception as e:
        print(f"[ERROR fetching audio] {e}")

    return None


def scrape_poem(poem_url, headers):
    data = {
        "url": poem_url,
        "title": None,
        "author": None,
        "dynasty": None,
        "content": None,
        "audio_url": None
    }
    try:
        resp = requests.get(poem_url, headers=headers, timeout=10)
        soup = BeautifulSoup(resp.text, "html.parser")

        # Title
        title_tag = soup.find("h1")
        if title_tag:
            data["title"] = title_tag.get_text(strip=True)

        # Author & Dynasty
        source_tag = soup.find("p", class_="source")
        if source_tag:
            author_tag = source_tag.find("a")
            if author_tag:
                data["author"] = author_tag.get_text(strip=True)
            text_full = source_tag.get_text(strip=True)
            start = text_full.find("〔")
            end = text_full.find("〕")
            if start != -1 and end != -1:
                data["dynasty"] = text_full[start + 1:end]

        # Poem Content
        content_tag = soup.find("div", class_="contson")
        if content_tag:
            data["content"] = content_tag.get_text("\n", strip=True)
            # if len(data["content"]) < 40:
            #     return data

        # Find the <img> with ID starting "speakerimg", to get the audio
        speaker_imgs = soup.find_all("img", id=True)
        for img in speaker_imgs:
            if img["id"].startswith("speakerimg"):
                audio_link = get_audio_url(img["id"], headers)
                if audio_link:
                    data["audio_url"] = audio_link
                    break  # Found one, so we can stop
    except Exception as e:
        print(f"[ERROR scraping poem] {poem_url} - {e}")

    return data


def main():
    headers = {
        "User-Agent": (
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
            "AppleWebKit/537.36 (KHTML, like Gecko) "
            "Chrome/58.0.3029.110 Safari/537.3"
        )
    }

    with open("gushiwen_poems2.csv", "w", encoding="utf-8", newline="") as csv_file:
        fieldnames = ["url", "title", "author", "dynasty", "content", "audio_url"]
        writer = csv.DictWriter(csv_file, fieldnames=fieldnames)
        writer.writeheader()

        # Example: scraping 1 page from Tang poems
        list_url = "https://so.gushiwen.org/gushi/tangshi.aspx?page=1"
        list_resp = requests.get(list_url, headers=headers)
        list_soup = BeautifulSoup(list_resp.text, "html.parser")

        # Collect poem links
        poem_links = list_soup.select("div.typecont span a")
        visited = set()

        for link in poem_links:
            poem_url = link.get("href")
            if poem_url.startswith("/"):
                poem_url = "https://so.gushiwen.org" + poem_url
            if poem_url not in visited:
                visited.add(poem_url)
                # Scrape each poem
                poem_data = scrape_poem(poem_url, headers)
                if len(poem_data["content"]) > 40:
                    writer.writerow(poem_data)
                    print(f"Scraped {poem_data['title']} => Audio: {poem_data['audio_url']}")

                # Sleep randomly to avoid hammering the server
                time.sleep(random.uniform(0, 1))


if __name__ == "__main__":
    main()
