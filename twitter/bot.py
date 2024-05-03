import os
import requests
from apscheduler.schedulers.blocking import BlockingScheduler
from base64 import b64encode


def get_bearer_token():
    # Twitter credentials from environment variables
    api_key = os.getenv('TWITTER_API_KEY')
    api_secret_key = os.getenv('TWITTER_API_SECRET_KEY')

    # Encode credentials
    credentials = f"{api_key}:{api_secret_key}"
    encoded_credentials = b64encode(credentials.encode()).decode()

    # Headers and data for obtaining the bearer token
    headers = {
        'Authorization': f'Basic {encoded_credentials}',
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    }
    data = 'grant_type=client_credentials'

    # Post request to obtain bearer token
    response = requests.post('https://api.twitter.com/oauth2/token', headers=headers, data=data)
    if response.status_code == 200:
        token = response.json()['access_token']
        return token
    else:
        raise Exception("Could not obtain bearer token")

def fetch_question():
    while True:
        response = requests.get('https://jous.app/api/question/random')
        question = response.json()['question']['content']
        if len(question) <= 280:  # Twitter's character limit
            return question

def tweet_question():
    bearer_token = get_bearer_token()
    try:
        question = fetch_question()
        headers = {
            "Authorization": f"Bearer {bearer_token}",
            "Content-Type": "application/json"
        }
        payload = {"text": question}
        response = requests.post('https://api.twitter.com/2/tweets', headers=headers, json=payload)
        if response.status_code == 201:
            print("Tweeted: " + question)
        else:
            print("Failed to tweet:", response.text)
    except Exception as e:
        print("An error occurred:", e)

def main():
    scheduler = BlockingScheduler()
    tweet_question()
    scheduler.add_job(lambda: tweet_question(), 'interval', hours=4)
    scheduler.start()

if __name__ == '__main__':
    main()
