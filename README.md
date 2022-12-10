# Start web server

```bash
cd web
npm install
npm run watch
```

# Re-create datasets-client

**Important** - run spark in Codespaces, not tested on macOS. Previously expereinced installation issues.

Nesessary for the client to run on device inference. The datasets contain words for different classes, for example politics, sex and health.

To get the bags of words for categories defined in spark_pipeline.py, run create_bags_of_words.ipynb, and split the output into separate files. It runs SparkNLP classifier on all english words from http://www.mieliestronk.com/wordlist.html and splits them into themes of interest.

The classifier is reused from the previous server side classification that would run user's searches through it. Thus a lot of confusing naming.

Place the files in datasets-client, format as bag\_<topic>.txt. These will be fetched from the client.

# Web server (Spark setup, old, now processing on javascript side)

Start with
gunicorn --reload 'server:app'
