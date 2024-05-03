import os
import requests
from requests_oauthlib import OAuth1
from apscheduler.schedulers.blocking import BlockingScheduler

def authenticate_twitter():
    # Twitter credentials from environment variables
    api_key = os.getenv('TWITTER_API_KEY')
    api_secret_key = os.getenv('TWITTER_API_SECRET_KEY')
    access_token = os.getenv('TWITTER_ACCESS_TOKEN')
    access_token_secret = os.getenv('TWITTER_ACCESS_TOKEN_SECRET')

    # Set up OAuth1 authentication
    auth = OAuth1(api_key, api_secret_key, access_token, access_token_secret)
    return auth

def fetch_question():
    while True:
        response = requests.get('https://jous.app/api/question/random')
        question = response.json()['question']['content']
        if len(question) <= 280:  # Twitter's character limit
            return question

def tweet_question(auth):
    try:
        question = fetch_question()
        headers = {"Content-Type": "application/json"}
        payload = {"text": question}
        response = requests.post('https://api.twitter.com/2/tweets', 
                                 headers=headers, json=payload, auth=auth)
        if response.status_code == 201:
            print("Tweeted: " + question)
        else:
            print("Failed to tweet:", response.text)
    except Exception as e:
        print("An error occurred:", e)

def main():
    auth = authenticate_twitter()
    scheduler = BlockingScheduler()
    tweet_question(auth)
    scheduler.add_job(lambda: tweet_question(auth), 'interval', hours=4)
    scheduler.start()

if __name__ == '__main__':
    main()
