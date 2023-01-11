chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.type === "startReadingTweets") {
      
    // Read the tweets on the page and calculate their sentiment scores
    readTweets();
        
    // Send the scores back to the background script
    chrome.runtime.sendMessage({ tag: "success"});
  }
});
  
function readTweets() {
  let tweets = document.querySelectorAll('[data-testid="tweetText"]');
    const tweetArray=[];
    tweets.forEach(element=>{
        const text = element.textContent;//TODO: might need to process the text, removing \n, etc. maybe process in server.
        console.log(text);
        tweetArray.push({tweet_text:text});
        // Send a request to the /api/language-detection endpoint to check if the tweet is in English
    })
    console.log(tweetArray);
    fetch('https://chrome-extension-3705.wl.r.appspot.com/api/language-detection', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(tweetArray)
    })
    .then((response) => response.json())
    .then(data => {//filter is_english = true, push into array, send post request.
      console.log(data);
      calculateSentimentScores(data,tweets);
    })
        
  }
  
  function calculateSentimentScores(detected,alltweets) {
    // Use a natural language processing library to calculate the sentiment scores of the tweets
    sentenceArray=[];
    english_tw_index=[];
    for(const [i, sentence] of detected.entries()){
      if (sentence.is_english) {
        // If the tweet is in English, send a request to the /api/sentiment-score endpoint to get the sentiment score
        sentenceArray.push({tweet_text:sentence.tweet_text})  
        english_tw_index.push(i)
      }
    }
    console.log(english_tw_index);
    console.log(sentenceArray);
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
      console.log(data);
      dateElements = document.querySelectorAll('time');
      data.forEach((value,i)=>{
        dateElement = dateElements[english_tw_index[i]]
        if(value.detected_mood=="positive"){//TODO: fix clicking twice, inject duplicated emoji
          dateElement.insertAdjacentHTML('afterend', '<span>😊</span>');
        }else if(value.detected_mood=="negative"){
          dateElement.insertAdjacentHTML('afterend', '<span>☹️</span>');
        }else{
          dateElement.insertAdjacentHTML('afterend', '<span>😐</span>');
        }
      })
    });
  }
