# December 4, remembering code, extending search type, preparing to get more statistics out

#wrapped/idea We're trying to make the book mean too complicated. We should start with setting the book title to "your searches". You of course can edit that

# Berkley user testing

In user interviews

# Nov 5

- Landing
  - [optional] Examples of other users
  - Instructions
- Upload form
  - [optional] Instructions to enable airplane mode
  - [optional] Checking if they have disabled internet (pinging)
- Once the form is uploaded, dropped them to filters (stories) carousel (argument searches)
  - [optional] Overall search stats
  - Single meme pre field with searches from interesting Pool
  - [optional] Interesting pool with favorite ing functionality (this will be global state, the same favorites will be used in mean template). You can edit this inline
- Click on any of the searches in the template to change it
  - You will see the interesting pull
  - Click any search to replace the search you have clicked on in the previous step, you will be navigated back to the template
  - [optional] You can favorite in this flow as well
- On top of each story there is a save button that the user can click to save to their

# Blocking

# Backlog

- Swiper is glitching on iOS chome, comment 3 months ago
-
- Set up analytics to detect on the user leaves the page (ideally to export their google data), and then opens it again (ideally to applauded the data)
  - Visibility change for background detection https://www.w3.org/TR/page-visibility/#sec-visibilitychange-event
  - Detect when the user closes the page https://www.geeksforgeeks.org/how-to-detect-browser-or-tab-closing-in-javascript/

# November 4

```javascript
<img
  src="https://www.tjtoday.org/wp-content/uploads/2021/01/IMG_7502.jpg"
  style={{
    maxWidth: "100%",
    maxHeight: "100%",
    position: "absolute",
    objectFit: "contain",
  }}
/>
```

I'm going insane, now that the viewport issue is fixed (went downsizing on mobile the image shrinks as expected)
When upsizing (on desktop) this shit does not work, the image is stuck in the corner

Forcing width and height two hundred percent actually works. Now that is over with, I'm realizing since my previous algorithm relied on having the image exactly the size of a parent relative element, I could position text relative to the parent element, WHICH NOW IS NOT THE SAME SIZE THAT THE IMAGE ITSELF. Will that make sense because I'm scaling the image.

Anyways I have spent roughly three hours on this stupid problem. And when you don't understand how to lay out something with fancy declarative methods - you bruteforce lay out with javascript. This is what I'm going to do.

[https://www.npmjs.com/package/react-resize-aware]

Fuck it I'm using Konva

platform is broken, App() !== <App />
Reack hooks are broken.

THE FUCKING PROBLEM WAS I INSTALLED KONVA OUTSIDE AGAAAAAIINNN

Hot reload? https://github.com/facebook/react/issues/16604#issuecomment-528663101

# November 2, 3

Set up developer environment

- Get bags of words to the server

Still some stupid reload issue

Capture html
https://html2canvas.hertzen.com/

# November 1

https://www.mondovo.com/keywords/most-searched-words-on-google/
We can get the keywords from there lol directly without classifying manually ...

- Software https://www.mondovo.com/keywords/software-keywords
- Finance https://www.mondovo.com/keywords/finance-keywords

Predicting your job

Word frequency - https://www.kaggle.com/datasets/rtatman/english-word-frequency

# October 31, tasting extension API history

90 days
Would the extension we con still simplify the export process

Tensorflow vocabulary https://storage.googleapis.com/tfjs-models/savedmodel/universal_sentence_encoder/vocab.json

## Embedded editors

- More customizations https://dev.to/zachsnoek/build-a-meme-generator-with-javascript-and-fabric-js-7o8
- Meme generator embedded!! https://codepen.io/ninivert/embed/BpLKRx?

- Total stats

# October 30, thoughts, client bag of words, asking for feedback

Watching some more combinator videos I don't think we are moving fast enough. We have been at it for month and we still don't have much to show except for some models.

How to resolve:

- Prioritize final user interface. It is very hard showing people lists and hoping to excite them
- Will have get to want on the features we want. We need to make a decision and make a specification, time boxesb
- Prioritized the dumbest bag of word models. These models in my approximation will do 70% iaWhat We Currently Have on the Server, based on the searches I haveat using universal sentence encoder

The results for ourselves we can get using a good model and mostly a manual approach.
Results for influencers they can also tweak to make this look good. So technically too measured the virality factor we don't even need the results to be any good. We need some very rough approximation, story creation user interface with a shiny format and probably a robust search for your searches, so influencers will have the tools to create fun content.

The formats I'm suggesting:

MVP

- 2 Truths and 1 lie
- Meme templates - manually look for searches to input there!

  - More customizations https://dev.to/zachsnoek/build-a-meme-generator-with-javascript-and-fabric-js-7o8
  - Meme generator embedded!! https://codepen.io/ninivert/embed/BpLKRx?
  - Uncover ghost let me see whoe you really are
  - Drake
  - Mega mind
  - red, blue dress
  - tom (jerry) with magazine
  - bobby showing https://www.tjtoday.org/wp-content/uploads/2021/01/IMG_7502.jpg
  - COpy?? You reading your searches lol https://cdn.ebaumsworld.com/mediaFiles/picture/718392/85780339.jpg
  - Paying sponge bob https://memetemplatehouse.com/wp-content/uploads/2020/05/SpongeBobs-Wallet-10052020221404_compress19-300x249.jpg
  - Types of headache https://www.memeatlas.com/images/templates/types-of-headaches-meme-template.jpg

[Optional]

- Tv characters
- Trends, I feel like people want to know when they were
  - Simple export of bag of words https://trends.google.com/trends/explore?date=all&geo=US&q=bitcoin

# October 27, cluster?

The idea is we produce these embeddings and do k means on them https://spark.apache.org/docs/latest/ml-clustering.html#k-means
Then we look at the original text and summarize into 3 words

We can use the Silhouette score to figure out the number of clusters we want, so K

Or we can do cluster centers
spark to get distance to centers -
from pyspark.ml.linalg import Vectors

This is a one liner to compute eucledian distance
.withColumn('distance', f.sqrt(f.expr('aggregate(transform(targ_vec, (element, idx) -> power(abs(element - element_at(init_vec, cast(idx + 1 as int))), 2)), cast(0 as double), (acc, value) -> acc + value)')))

https://stackoverflow.com/a/72440380/5278310

# October 6, 5050 split, setup github EqualHeadroom

# September 29

Kirill

How to run the server
`USE_PRECALCULATED_BIASES=TRUE gunicorn --bind :8000 --reload --timeout 0 main:app`

- Serve index
- Prettify output

  - Maybe we should use the server provided but for us?
  - Maybe include the date?

- [x] Reload gunicorn on filei| safe
- Accept zip file on the server
- Optional: Train a work, fun classifier
  - Do pre filtering
  - Single words found

# September 28, Form file upload,top masculine and feminine search is found

# September 28, word2vec, Model build and http and point tested

# September 26, parsing, bag of words, created repo

# September 25, o auth takeout@wrappedbot

Looks like we can't easily request sync access :D Will need verification? Maybe we can stay in test mode?
https://developers.google.com/drive/api/guides/about-auth
Because we are OAuthing the service user.
Seems much easier to just get the drive.file scope :D

Pair programmed with isiah, used my markdown google dogs for authentication example.
