# October 31, vocab

# Vocabulary

Tensorflow vocabulary 8k https://storage.googleapis.com/tfjs-models/savedmodel/universal_sentence_encoder/vocab.json
432K Oct 31 23:49 vocabulary.json

Super basic NLP review https://towardsdatascience.com/a-gentle-introduction-to-natural-language-processing-e716ed3c0863

TF-IDF
http://naturalnode.github.io/natural/tfidf.html

Number of times word appears / number of words un search

- log(number of searches / number of documents with this word)

This will help us get rid of technical searches

Getting rid of too many concatinated things would also be good.

## Tokenising Stemming

http://naturalnode.github.io/natural/Tokenizers.html

Sweeet https://github.com/NaturalNode/natural/issues/25#issuecomment-739035970
Seems like they have browser support

## English

So, let’s look back at the question. If we want to talk about how many words there are in English, there are three key numbers to remember: more than a million total words, about 170,000 words in current use, and 20,000-30,000 words used by each individual person.

I am thinking to run these 30k through google nlp and get classes.

# October 30

- Run toxicity on samples in the browser
- Export json search history for it myself and find most toxic ones
- Look at the toxicity classifier and see if I can fork it

1000 searches took 0.5 minutes, but also on M1 and
got GPU warning: High memory usage in GPU: 2609.57 MB, most likely due to a memory leak

We can batch these classifications and show results slowly to avoid overloading. I am assuming the samples are queed in GPU for prosessing at each stage, so mostly data is just waiting in GPU.
Smaller batches should help. YEP

100 took 0.01 minutes, which is 50 times faster, but only 10 times smaller. So batching would totally work :D

but this is also M1 mac, so not a really good test. Will test on mobile soon
took 3 minutes :/ on M1 for all my searches - 24k. Again, this is on laptop

This shit is veeery slow on mobile.
To try?

- Detect backend used
- Make sure its gpu

[idea] Do on computer only??

### Export

Entire export takes a long time! Over 5 minutes, unacceptable.
Link to specific portion of the page

- https://takeout.google.com/#:~:text=Multiple%20formats-,My%20Activity,your%20activity%20data%2C%20along%20with%20image%20and%20audio%20attachments.%20More%20info,-insert_drive_file

# Backlog

- Extract archive
- On archiving on the browser https://github.com/gildas-lormeau/zip.js
  - demo https://github.com/gildas-lormeau/zip.js/blob/gh-pages/demos/demo-read-file.js

# Ideas

I have tried googling for classifiers using tensorflow javascript but without much success. Only this one article popped up

Text classification toxicity
https://medium.com/tensorflow/text-classification-using-tensorflow-js-an-example-of-detecting-offensive-language-in-browser-e2b94e3565ce

[Idea] May be directly search GitHub?
