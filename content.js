chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.type === "startReadingTweets") {
    // Read the tweets on the page and calculate their sentiment scores
    readTweets();
    window.addEventListener('scroll', function() {
      // Check if the selected div is at the top of the viewport
      if(myDiv){
        if (myDiv.getBoundingClientRect().top <= 100) {
          readTweets();
        }
      }
    }); 

  
  }
});
  
function readTweets() {
  let tweets = document.querySelectorAll('[data-testid="tweetText"]');
  myDiv = tweets[tweets.length-1];
  let dateElmts = document.querySelectorAll('time');
  const tweetArray=[];
    tweets.forEach(element=>{
      parent = element.parentNode.parentNode.parentNode;
      if(parent.getElementsByTagName("time").length>0){//filter promoted content
        const text = element.innerText;
        tweetArray.push({tweet_text:text});
      }
    })
    // Send a request to the /api/language-detection endpoint to check if the tweet is in English
    fetch('https://chrome-extension-3705.wl.r.appspot.com/api/language-detection', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(tweetArray)
    })
    .then((response) => response.json())
    .then(data => {
      calculateSentimentScores(data,dateElmts);
    })
   
  }
 //calculate the sentiment scores of the tweets
function calculateSentimentScores(detectedTweet,dateElements) {
  sentenceArray=[];
  english_tw_index=[];
  for(const [i, sentence] of detectedTweet.entries()){
    // If the tweet is in English, send a request to the /api/sentiment-score endpoint to get the sentiment score
    if (sentence.is_english) {
      sentenceArray.push({tweet_text:sentence.tweet_text})  
      english_tw_index.push(i)
    }
  }
  return fetch('https://chrome-extension-3705.wl.r.appspot.com/api/sentiment-score', {
    method: 'POST',
    headers: {
    'Content-Type': 'application/json'
    },
    body: JSON.stringify(sentenceArray)
  })
  .then((response) => response.json())
  .then(data => {
    // Based on the sentiment score, add the appropriate emoji next to the date of the tweet
    data.forEach((value,i)=>{
      dateElement = dateElements[english_tw_index[i]];
      if (dateElement.nextElementSibling==null) {//if the emoji has not been inserted, insert mood emoji.
        if(value.detected_mood=="positive"){
          dateElement.insertAdjacentHTML('afterend', '<span>·Detected Mood:😊</span>');
        }else if(value.detected_mood=="negative"){
          dateElement.insertAdjacentHTML('afterend', '<span>·Detected Mood:☹️</span>');
        }else{
          dateElement.insertAdjacentHTML('afterend', '<span>·Detected Mood:😐</span>');
        }
      }
    })
  });  
}  

