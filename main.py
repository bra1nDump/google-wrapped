# Import Spark NLP
from sparknlp.base import *
from sparknlp.annotator import *
from sparknlp.pretrained import PretrainedPipeline
import sparknlp

# Start SparkSession with Spark NLP
# start() functions has 3 parameters: gpu, m1, and memory
# sparknlp.start(gpu=True) will start the session with GPU support
# sparknlp.start(m1=True) will start the session with macOS M1 support
# sparknlp.start(memory="16G") to change the default driver memory in SparkSession
spark = sparknlp.start(memory="2G")

# Download a pre-trained pipeline
pipeline = PretrainedPipeline('explain_document_dl', lang='en')

# Your testing dataset
text = """
The Mona Lisa is a 16th century oil painting created by Leonardo.
It's held at the Louvre in Paris.
"""

# Annotate your testing dataset
result = pipeline.annotate(text)

# What's in the pipeline
print(list(result['entities']))
# Output: ['entities', 'stem', 'checked', 'lemma', 'document',
'pos', 'token', 'ner', 'embeddings', 'sentence']

# Check the results
print(result['entities'])
# Output: ['Mona Lisa', 'Leonardo', 'Louvre', 'Paris']