from flask import Flask,request,jsonify
from flask_cors import CORS
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
from langdetect import detect

app = Flask(__name__)
CORS(app)

@app.route('/', methods=["GET","POST"])
def homepage():
    """show homepage."""
    print("worked")
    return "hello world"

@app.route('/api/language-detection', methods=['POST'])
def language_detection():
    resArray = []
    for element in request.json:
        text = element['tweet_text']
    # Read the text of the tweet from the request body
        is_english = detect(text) == 'en'
     # Detect the language of the text
        resArray.append({"tweet_text":text,"is_english":is_english})

    # Return the language detection result as the response
    return jsonify(resArray)

@app.route('/api/sentiment-score', methods=['POST'])
def sentiment_score():
    resArray=[]
    analyzer = SentimentIntensityAnalyzer()
    # Read the text of the tweet from the request body
    for sentence in request.json:
        text = sentence['tweet_text']
        vs = analyzer.polarity_scores(text)
        score={"positive":vs["pos"],"negative":vs["neg"],"neutral":vs["neu"]}
        # Calculate the sentiment score of the text
        # Determine the mood of the text based on the score
        sentiment = vs['compound']
        if sentiment >= 0.05:
            mood = 'positive'
        elif sentiment <= -0.05:
            mood = 'negative'
        else:
            mood = 'neutral'
        resArray.append({"tweet_text":text,"sentiment_score":score,"detected_mood":mood})
  # Return the sentiment score and mood as the response
    return jsonify(resArray)

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=8080, debug=True)