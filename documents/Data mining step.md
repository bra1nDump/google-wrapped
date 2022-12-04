# High level goals

- Extract funny searches. Trigger childish playful mood.
- Extract life phases. Trigger reflection and nostalgic.
- Do not duplicate what can be found in Apple / Google photo summaries. We are uncovering what's bothering people REALLY.

## To do

- Add statistics per group, and overall
- Ed celebrities, and their categories. We can query wikipedia https://www.mediawiki.org/wiki/Wikibase/API

# Assumptions

~ 10k / year ~ 30 / day queries
Assuming 1-5 worthy personal searches
Assuming filtering out work stuff leaves us with 20/80 gold/boring searches

Developers have more google searches, total and specifically work related then the rest of the population.

# Strategy, on device bag of words

More details [[google-wrapped/README]]

Using old spark pipeline given multiple examples for the labels we want to classify, classify entire english dictionary. Used these files on the client for bag of word model.

# Strategy (Old)

Start with raw list of searches having basic information: query, time, location.
Apply a cheap 'boring' filter.
We extract as many signals as we can.
We put all this data into a table we can play around with manually, or write queries against using the signals. I imagine filters, group by's.

We can use profiling signals to decide what kind of stories we want to generate. For example don't show food card to someone who barely searched for any food. When data is lacking tho we can present this as stats - "We notice you don't eat much compared to the rest of us, you must be air-fed, please share this secret"

# Clustering themes

Cosine similarity spark nlp
https://github.com/JohnSnowLabs/spark-nlp/issues/621

The idea is we produce these embeddings and do k means on them https://spark.apache.org/docs/latest/ml-clustering.html#k-means
Then we look at the original text and summarize into 3 words

We can use the Silhouette score to figure out the number of clusters we want, so K

Or we can do cluster centers
spark to get distance to centers - from pyspark.ml.linalg import Vectors

Summarization

https://nlp.johnsnowlabs.com/2020/12/21/t5_small_en.html

Roberta xxl

https://nlp.johnsnowlabs.com/2022/04/14/roberta_embeddings_ruRoberta_large_ru_3_0.html

Russian embeddings
Small
https://nlp.johnsnowlabs.com/2022/04/12/distilbert_embeddings_distilbert_base_ru_cased_ru_3_0.html

Large
https://nlp.johnsnowlabs.com/2022/04/11/bert_embeddings_bert_base_ru_cased_ru_3_0.html

Clustering spark

https://index.scala-lang.org/clustering4ever/clustering4ever

# HuggingFace (many models)

https://huggingface.co/
Batching https://huggingface.co/course/chapter2/5?fw=pt

# JohnSnowLabs spark-nlp

https://github.com/JohnSnowLabs/spark-nlp

Examples: https://github.com/JohnSnowLabs/spark-nlp-workshop

Docs Scala - great: https://nlp.johnsnowlabs.com/api/index.html
Docs pythong ... not so great?: https://nlp.johnsnowlabs.com/api/python/reference/index.html

## Visualization tools

https://github.com/JohnSnowLabs/spark-nlp-display

# Google NLP [might use for test data labeling]

- Google natural language API https://cloud.google.com/natural-language/docs/reference/libraries#client-libraries-install-nodejs
- Multi language support https://cloud.google.com/natural-language/docs/languages

## Classify text

- Docs https://cloud.google.com/natural-language/docs/classify-text-tutorial
- List of categories available - looks promising /Adult :D https://cloud.google.com/natural-language/docs/categories

## Analyze entities

- Docs https://cloud.google.com/natural-language/docs/analyzing-entities
- Sample https://cloud.google.com/natural-language/docs/samples/language-entities-text

This example looks promising, although text classification seems more important for us.

```javascript
console.log("Entities:");
entities.forEach((entity) => {
  console.log(entity.name);
  console.log(` - Type: ${entity.type}, Salience: ${entity.salience}`);
  if (entity.metadata && entity.metadata.wikipedia_url) {
    console.log(` - Wikipedia URL: ${entity.metadata.wikipedia_url}`);
  }
});
```

# Spacy

Comparison with spark
https://medium.com/spark-nlp/spacy-or-spark-nlp-a-benchmarking-comparison-23202f12a65c#:~:text=As%20expected%2C%20Spark%20NLP%20proved,NLP's%20speed%20becomes%20clearly%20visible.

## Key takeaways

- Java 8/11 !!Oracle/OpenJDK
- sanity check runs

# Log

Setting up Spark NLP
Struggling to run on M1
Trying GitHub Code spaces,

And other ideas to use a preconfigured docker the set up already there https://github.com/JohnSnowLabs/spark-nlp/discussions/1714

Codespaces

raise Py4JNetworkError("Answer from Java side is empty")
https://stackoverflow.com/questions/37252809/apache-spark-py4jerror-answer-from-java-side-is-empty
Low on memory?

Downgrade java to 8
https://github.com/JohnSnowLabs/spark-nlp/issues/846

Maybe docker py spark?
https://github.com/JohnSnowLabs/spark-nlp/issues/846#issuecomment-854334189

## export JAVA_HOME=/docker-java-home

Trying use scala - maybe python just has shittier support?

Getting sbt (aka gradle for scala)
sudo apt-get update
sudo apt-get install apt-transport-https curl gnupg -yqq
echo "deb https://repo.scala-sbt.org/scalasbt/debian all main" | sudo tee /etc/apt/sources.list.d/sbt.list
echo "deb https://repo.scala-sbt.org/scalasbt/debian /" | sudo tee /etc/apt/sources.list.d/sbt_old.list
curl -sL "https://keyserver.ubuntu.com/pks/lookup?op=get&search=0x2EE0EA64E40A89B84B2DF73499E82A75642AC823" | sudo -H gpg --no-default-keyring --keyring gnupg-ring:/etc/apt/trusted.gpg.d/scalasbt-release.gpg --import
sudo chmod 644 /etc/apt/trusted.gpg.d/scalasbt-release.gpg
sudo apt-get update
sudo apt-get install sbt

BINGO both sbt and Java are probably killed by OOM
(echo "li = []" ; echo "for r in range(9999999999999999): li.append(str(r))") | python
Shows killed

https://www.baeldung.com/linux/what-killed-a-process

Article, docker oom, java https://plumbr.io/blog/java/oomkillers-in-docker-are-more-complex-than-you-thought

Export logs works from client side extension, found some OOM mentions, but not like anything was killed
Check google lab tensor full version 2.8.2
Make sure the container has the same version

Java version is different from java_home

JDK_JAVA_OPTIONS=-Xmx1024m
JAVA_TOOL_OPTIONS=-Xmx1024m
?? maybe second one is better?
Setting java options https://stackoverflow.com/questions/28327620/difference-between-java-options-java-tool-options-and-java-opts

sdk use java 11.0.16.1-ms
It want either open or oracle!!!!!

alias java=/usr/lib/jvm/java-8-openjdk-amd64/jre/bin/java
export JAVA_HOME=/usr/lib/jvm/java-8-openjdk-amd64

@bra1nDump ➜ /workspaces/example-codespaces (main ✗) $ java -version
openjdk version "1.8.0_342"
OpenJDK Runtime Environment (build 1.8.0_342-8u342-b07-0ubuntu1~20.04-b07)
OpenJDK 64-Bit Server VM (build 25.342-b07, mixed mode)
@bra1nDump ➜ /workspaces/example-codespaces (main ✗) $

Lab setup https://github.com/JohnSnowLabs/spark-nlp-workshop/blob/master/colab_setup.sh

Cuda https://github.com/devcontainers/features/tree/main/src/nvidia-cuda
Has more steps on the boottom :D

How to find my Linux distribution
https://www.cyberciti.biz/faq/find-linux-distribution-name-version-number/

@bra1nDump ➜ /workspaces/example-codespaces (main ✗) $ cat /etc/\*-release
DISTRIB_ID=Ubuntu
DISTRIB_RELEASE=20.04
DISTRIB_CODENAME=focal
DISTRIB_DESCRIPTION="Ubuntu 20.04.5 LTS"
NAME="Ubuntu"
VERSION="20.04.5 LTS (Focal Fossa)"
ID=ubuntu
ID_LIKE=debian
PRETTY_NAME="Ubuntu 20.04.5 LTS"
VERSION_ID="20.04"
HOME_URL="https://www.ubuntu.com/"
SUPPORT_URL="https://help.ubuntu.com/"
BUG_REPORT_URL="https://bugs.launchpad.net/ubuntu/"
PRIVACY_POLICY_URL="https://www.ubuntu.com/legal/terms-and-policies/privacy-policy"
VERSION_CODENAME=focal
UBUNTU_CODENAME=focal

From NVIDEA
distribution=$(. /etc/os-release;echo $ID$VERSION_ID) \
 && curl -fsSL https://nvidia.github.io/libnvidia-container/gpgkey | sudo gpg --dearmor -o /usr/share/keyrings/nvidia-container-toolkit-keyring.gpg \
 && curl -s -L https://nvidia.github.io/libnvidia-container/$distribution/libnvidia-container.list | \
 sed 's#deb https://#deb [signed-by=/usr/share/keyrings/nvidia-container-toolkit-keyring.gpg] https://#g' | \
 sudo tee /etc/apt/sources.list.d/nvidia-container-toolkit.list

Error response from daemon: could not select device driver "" with capabilities: [[gpu]].

GH search, --gpu
https://cs.github.com/?scopeName=All+repos&scope=&q=%22--gpu%22+path%3A.devcontainer.json

Note: nvidia-docker v2 uses --runtime=nvidia instead of --gpus all. nvidia-docker v1 uses the nvidia-docker alias, rather than the --runtime=nvidia or --gpus all command line flags.

Looks like run arguments doesn't even support gpu anymore, only user configurations for running.
Looked at the code https://cs.github.com/devcontainers/cli/blob/398154f68685fb2d8ca72d43569345c66092ecb4/src/spec-node/singleContainer.ts?q=runArgs+repo%3Adevcontainers%2Fcli#L253

[Key] Here are the container creation logs that might come in handy
/workspaces/.codespaces/.persistedshare/creation.log
/workspaces/.codespaces/shared/merged_devcontainer.json

# October 2

Amazon web services
Likely will use ESC?

- Running an instance with gpu https://aws.amazon.com/blogs/containers/running-gpu-based-container-applications-with-amazon-ecs-anywhere/
-

## Goal:

Create a data set with a bunch of metadata for each search

- Lets start with classification labels :
  - toxic
  - problematic
  - politically incorrect
  - sexual
  - education

parknpl
https://gist.github.com/vkocaman/e091605f012ffc1efc0fcda170919602#file-annotators-csv

Tutorial: https://towardsdatascience.com/introduction-to-spark-nlp-foundations-and-basic-components-part-i-c83b7629ed59
Date of frame tutorial https://github.com/JohnSnowLabs/spark-nlp-workshop/blob/master/tutorials/PySpark/2.PySpark_DataFrames.ipynb

SparkUI expose ports
WARN Utils: Service 'SparkUI' could not bind on port 4040. Attempting port 4041.
Seems cool, might come in handy to monitor work

# October 4

FUCKING MAKE SURE THE SHIT YOU THINK IS RUNNING IS ACTUALLY RUNNING !!!

notebook still giving me issues :D

looking at difference between python and notebook

```python
os_e = set(os.environ.items())
>>> notebook = set(x.items()) # from notebook
>>> os_e ^ notebook
{('PAGER', 'cat'), ('TERM', 'xterm-256color'), ('VSCODE_IPC_HOOK_CLI', '/tmp/vscode-ipc-3bff538a-1533-4cb3-8b1a-1e98db761ddd.sock'), ('PWD', '/workspaces/example-codespaces'), ('PYDEVD_IPYTHON_COMPATIBLE_DEBUGGING', '1'), ('GIT_ASKPASS', '/vscode/bin/linux-x64/784b0177c56c607789f9638da7b6bf3230d47a8c/extensions/git/dist/askpass.sh'), ('PYTHONUNBUFFERED', '1'), ('CLICOLOR', '1'), ('TERM_PROGRAM_VERSION', '1.71.0'), ('ELECTRON_RUN_AS_NODE', '1'), ('VSCODE_GIT_ASKPASS_NODE', '/vscode/bin/linux-x64/784b0177c56c607789f9638da7b6bf3230d47a8c/node'), ('VSCODE_CWD', '/vscode/bin/linux-x64/784b0177c56c607789f9638da7b6bf3230d47a8c'), ('CODESPACE_VSCODE_FOLDER', '/workspaces/example-codespaces'), ('VSCODE_GIT_IPC_HANDLE', '/tmp/vscode-git-84361127b4.sock'), ('_', '/usr/local/bin/python'), ('VSCODE_GIT_ASKPASS_MAIN', '/vscode/bin/linux-x64/784b0177c56c607789f9638da7b6bf3230d47a8c/extensions/git/dist/askpass-main.js'), ('SPARK_BUFFER_SIZE', '65536'), ('VSCODE_IPC_HOOK_CLI', '/tmp/vscode-ipc-138c3384-1628-41bd-82ac-043f4461813e.sock'), ('VSCODE_AGENT_FOLDER', '/root/.vscode-remote'), ('PWD', '/vscode/bin/linux-x64/784b0177c56c607789f9638da7b6bf3230d47a8c'), ('PATH', '/usr/local/share/nvm/versions/node/v16.17.1/bin:/vscode/bin/linux-x64/784b0177c56c607789f9638da7b6bf3230d47a8c/bin/remote-cli:/usr/local/share/nvm/current/bin:/usr/local/python/current/bin:/usr/local/py-utils/bin:/usr/local/bin:/usr/local/share/nvm/versions/node/v16.17.1/bin:/usr/local/python/current/bin:/usr/local/py-utils/bin:/usr/local/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/root/.local/bin'), ('TERM_PROGRAM', 'vscode'), ('VSCODE_GIT_ASKPASS_EXTRA_ARGS', ''), ('GIT_PAGER', 'cat'), ('VSCODE_HANDLES_UNCAUGHT_ERRORS', 'true'), ('VSCODE_AMD_ENTRYPOINT', 'vs/workbench/api/node/extensionHostProcess'), ('SPARK_AUTH_SOCKET_TIMEOUT', '15'), ('PATH', '/usr/local/bin:/vscode/bin/linux-x64/784b0177c56c607789f9638da7b6bf3230d47a8c/bin/remote-cli:/usr/local/share/nvm/current/bin:/usr/local/python/current/bin:/usr/local/py-utils/bin:/usr/local/bin:/usr/local/share/nvm/versions/node/v16.17.1/bin:/usr/local/python/current/bin:/usr/local/py-utils/bin:/usr/local/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/root/.local/bin'), ('SHLVL', '2'), ('VSCODE_NLS_CONFIG', '{"locale":"en","availableLanguages":{}}'), ('TERM', 'xterm-color'), ('VSCODE_HANDLES_SIGPIPE', 'true'), ('GIT_EDITOR', 'code --wait'), ('COLORTERM', 'truecolor'), ('SHLVL', '1'), ('MPLBACKEND', 'module://matplotlib_inline.backend_inline'), ('_', '/bin/cat'), ('PYTHONIOENCODING', 'utf-8')}
```

We have some parsing issue it seems, example:
Searched ss
Searched dnsnns
Searched ahhshs
Searched fburl/builds

Well shit :D
Looks like zero-shot will be difficult to setup
https://github.com/JohnSnowLabs/spark-nlp/issues/7162
Are we back to huggingface ? :D

They can be mated .. but why tho ... https://medium.com/spark-nlp/importing-huggingface-models-into-sparknlp-8c63bdea671d

Probably github examples are better
https://github.com/JohnSnowLabs/spark-nlp-workshop/blob/master/jupyter/transformers/HuggingFace%20in%20Spark%20NLP%20-%20AlbertForSequenceClassification.ipynb

# October 4, pyspark datatframes, work / fun classifier

https://sparkbyexamples.com/pyspark
https://spark.apache.org/docs/3.3.0/api/python/reference/index.html

Getting started https://spark.apache.org/docs/latest/sql-getting-started.html
Map functions https://spark.apache.org/docs/latest/sql-ref-functions-builtin.html#map-functions

[Key] Super basic dataframe stuff
https://notebooks.gesis.org/binder/jupyter/user/apache-spark-5aam2twa/notebooks/python/docs/source/getting_started/quickstart_df.ipynb

Parquet format :D $$
https://www.databricks.com/glossary/what-is-parquet#:~:text=What%20is%20Parquet%3F,handle%20complex%20data%20in%20bulk.

# October 6, park, fun work, multi labels

Not such a bad idea to get the top prediction for each category and sword by it.
Main downside - it does not work

1. Number of each category present in the top results will not be the same, the most popular category will dominate
2.

```python
(
    labled
    .filter(labled.kind == 'Searched')
    .filter(prediction.result != 'Work')
    # .orderBy(desc(max(all_category_score_column_names)))
    .orderBy(desc(max(concat(prediction.result, '_score'))))
    .unionAll
    .show(300, truncate=300)
)
```

Enter window functions!!!
https://sparkbyexamples.com/spark/spark-sql-window-functions/#:~:text=2.2%20rank%20Window%20Function

We can also straight up ask Alberto if you're smart based on the context of your searches
https://nlp.johnsnowlabs.com/api/com/johnsnowlabs/nlp/annotators/classifier/dl/AlbertForQuestionAnswering.html

Maybe it's a better idea to use a very generic network https://nlp.johnsnowlabs.com/api/com/johnsnowlabs/nlp/annotators/seq2seq/T5Transformer.html

[Key] Important observation is I don't have too many non work searches!!
Over the past four years it's just ~2_000 it seems?
With the total searches and visits 40_000

# October 12,

spark cluster access at http://localhost:4040

# October 15, Reverting back to work fun classification, potentially manual labeling

This worked really badly, nothing got classified as work. Which makes sense, If you classify anything as other the chances are you will get it right because the sample set is so unbalanced.

## We want to do multiple binary classifications instead of scoring each class

training_samples_work_and_others = map(lambda x: [x[0], 'Work' if x[1] == 'Work' else 'Other'], traing_samples)
training_data = spark.createDataFrame(training_samples_work_and_others).toDF("text", "category")

## Cold to get scores for each predicted label in a separate column

all_category_score_columns = [category_score_column(
category) for category in all_labels]

print(f'Total history entries: {labled.count()}')

```python
non_work_searches = (
labled.select(
[
labled.text,
prediction.result.alias("predicted_category"),
]
+ all_category_score_columns
)
.filter(labled.kind == 'Searched')
.filter(prediction.result != 'Work')
)
```

## Label my data, and for god's sake let's get data of other people as well

The dependency is to fix parsing of my own data, I don't want to label the data twice.
I think I can still estimate the number of funny searches and topics I roughly search for.

## Filtering out work related things, pivoting too clustering potentially?

I'm getting more convinced that detecting non work related searches will be very hard for different people.
For me programming is work related but medical searches are probably curiosity or fear related.
For people in the medical field this will probably be wrong.

I wonder if we should pivot from classification to clustering.
This will move the burden off deciding which topics are funny from us to the people.
By selecting clusters and zooming in they effectively tell us what they are interested in seeing more off.

There's a couple of categories we can probably define as funny though.

# October 22

Just archiving some examples I came up with.
This include some note on why multi label classification would work better (potentially).

```python
# Definitely feels like multi label would work much better.
# That's not even just for training, but also for predicting.
# What of something is both dumb and fun at the same time?
all_samples = [
    # Work
    ['work', 'Work'],
    ['how to make a python3 spark dataframe?', 'Work'],
    ['i got tired after my presentation in front of colleagues', 'Work'],
    # Fun
    ['fun', 'Fun'],
    ['where to go out and eat with friends?', 'Fun'],
    ['Best things to bring to a beach party', 'Fun'],
    ['Fun things to do after a stressful day', 'Fun'],
    # Dumb
    # We actually do not want to label Dumb, as being dumb
    ['What does 2 + 2 equals', 'Dumb'],
    ['Is the earth flat?', 'Dumb'],
    # Smart
    ['How do I save for retirement?', 'Smart'],
    ['How do I stay healthy?', 'Smart'],
    # Violent
    ['Martial arts around me', 'Violent'],
    ['How do I beat somebody up?', 'Violent'],
    ['Murder videos', 'Violent'],
    # Illegal
    ['How do I break the law and get away with it?', 'Illegal'],
    ['How to I buy drugs?', 'Illegal'],
    # Medical
    ['My stomach hurts what do I do?', 'Medical'],
    ['I have a hard time focusing, do I have ADHD?', 'Medical'],
    # Sexual
    ['How do I use a condom?', 'Sexual'],
    ['Sex toys', 'Sexual'],
    ['How do I please my partner?', 'Sexual'],
    # Romantic
    ['Romantic movies', 'Romantic'],
    ['buy rose petals around me', 'Romantic'],
    # Incoherent
    # ['adjf;qjdf asd fakldffalksdfj asd fasdkfljalkfd', 'Incoherent'],
    # ['I am loooooeee aaaa confiss fond confused not a ssssentence why is this ap', 'Incoherent'],
]
all_labels = list(set(map(lambda x: x[1], all_samples)))
```
