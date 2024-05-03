import os
import tweepy
import requests
from apscheduler.schedulers.blocking import BlockingScheduler

def authenticate_twitter():
    # Twitter credentials from environment variables
    api_key = os.getenv('TWITTER_API_KEY')
    api_secret_key = os.getenv('TWITTER_API_SECRET_KEY')
    access_token = os.getenv('TWITTER_ACCESS_TOKEN')
    access_token_secret = os.getenv('TWITTER_ACCESS_TOKEN_SECRET')

    # Authenticate to Twitter
    auth = tweepy.OAuth1UserHandler(api_key, api_secret_key, access_token, access_token_secret)
    api = tweepy.API(auth)
    return api

def fetch_question():
    response = requests.get('https://jous.app/api/question/random')
    question = response.json()['question']['content']
    return question

def tweet_question(api):
    try:
        question = fetch_question()
        api.update_status(question)
        print("Tweeted: " + question)
    except Exception as e:
        print("An error occurred:", e)

def main():
    api = authenticate_twitter()
    scheduler = BlockingScheduler()
    scheduler.add_job(lambda: tweet_question(api), 'interval', hours=4)
    scheduler.start()

if __name__ == '__main__':
    main()
