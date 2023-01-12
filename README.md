# chrome-extension

A Chrome Extension that works only on the Twitter website. By clicking the extension icon, the extension will read the tweets presented in the timeline. After detecting English tweets, it will calculate the sentiment score of these tweets, and based on the score, it will show three emojis (😊, 😐, ☹️) next to the date of the tweet.
Promoted tweet contents will not be sent to the server, whereas links and tags are counted as text content to be sent to server.
It will keep detecting mood and adding emoji to tweets when scrolling down on the same page. After clicking on links and going to another page, the extension icon will have to be clicked again.
![image](https://user-images.githubusercontent.com/84560385/211979822-a315e1c0-23ce-4e65-80af-2b0af15a6ac8.png)
