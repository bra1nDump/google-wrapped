
import findspark

from sparknlp import DocumentAssembler, SparkSession
from sparknlp.annotator import ClassifierDLApproach, UniversalSentenceEncoder

from pyspark.sql import DataFrame, Window, Column
from pyspark.sql.functions import asc, row_number, col, desc, sqrt, expr
import pyspark.sql.functions as f

from pyspark.ml import Pipeline, PipelineModel, Transformer

from pyspark.ml.clustering import KMeans
from pyspark.ml.evaluation import ClusteringEvaluator


findspark.init()


def spark_init():
    """Returns a spark session. Tries to reduce logging."""
    spark = (
        SparkSession.builder
        .appName("Spark NLP")
        .master("local[*]")
        .config("spark.driver.memory", "10G")
        .config("spark.serializer", "org.apache.spark.serializer.KryoSerializer")
        .config("spark.kryoserializer.buffer.max", "2000M")
        .config("spark.driver.maxResultSize", "0")
        .config("spark.jars.packages", "com.johnsnowlabs.nlp:spark-nlp_2.12:4.2.0")
        .getOrCreate()
    )

    spark.sparkContext.setLogLevel("ERROR")

    print('spark version ' + spark.version)
    return spark


def prepare_data(history: DataFrame):
    """Expects kind, query, url columns in dataframe."""
    assert (set(history.schema.fieldNames()) == set(['kind', 'text', 'url']))

    print('history count: ' + str(history.count()))

    # Keep searches only
    search_history = history.filter(history.kind == 'Searched')

    print('search_history count: ' + str(search_history.count()))

    return search_history


def bert_embeddings_pipeline() -> PipelineModel:
    """Expects 'text' column in dataframe,
    adds 'sentence_embeddings' column of type vector to output
    """

    # TODO: Try reading saved model first
    # PipelineModel.load()

    document = (
        DocumentAssembler()
        .setInputCol("text")
        .setOutputCol("document")
    )

    # we can also use sentence detector here
    # if we want to train on and get predictions for each sentence
    # downloading pretrained embeddings
    sentence_encoder = (
        UniversalSentenceEncoder.pretrained()
        .setInputCols(["document"])
        .setOutputCol("sentence_embeddings")
    )

    pipeline = PipelineModel(
        stages=[
            document,
            sentence_encoder
        ]
    )

    return pipeline


# TODO: add label parameter so we can use serialized pipeline instead of retraining
def classifier_pipeline(training_data: DataFrame) -> PipelineModel:
    """Expects 'text' column in dataframe,
    adds 'predicted_category' column.
    It will be further parsed by helpers.
    """
    # the classes/labels/categories are in label column
    classsifierdl = (
        ClassifierDLApproach()
        .setInputCols(["sentence_embeddings"])
        .setLabelColumn("label")
        .setOutputCol("prediction")
        .setMaxEpochs(40)
        .setEnableOutputLogs(True)
    )

    pipeline = Pipeline(
        stages=[
            classsifierdl
        ]
    )

    return pipeline.fit(training_data)


def run_classifier(classifier: Transformer, input_data_frama: DataFrame, label_to_score: str):
    """Expects 'prediction' column in dataframe, tested with ClassifierDLApproach.
    Adds a <label>_score column containing confidence.
    Expected to be used with binary classifier."""
    labeled = classifier.transform(input_data_frama)

    # To understand shema use classifier.printSchema()
    prediction = labeled.prediction.getItem(0)

    def category_score_column(category: str):
        return prediction.metadata.getItem(category).alias(f"confidence")

    labeled_pretty = labeled.select(
        [
            labeled.text.substr(0, 80).alias('text'),
            prediction.result.alias("predicted_label"),
            category_score_column(label_to_score)
        ]
    )

    return labeled_pretty

# Feature code

# Helpers

# Stolen from https://github.com/apache/datafu


def dedup_top_n(df: DataFrame,
                n: int,
                group_col: Column,
                order_col: Column):
    """
    Used get the top N records (after ordering according to the provided order columns)
    in each group.
    @param df DataFrame to operate on
    @param n number of records to return from each group
    @param group_col column to group by the records
    @return DataFrame representing the data after the operation
    """
    window = Window.partitionBy(group_col).orderBy(order_col)
    return df.withColumn("rn", row_number().over(window)).where(
        col("rn") <= n).drop("rn")


def sexual_samples(spark: SparkSession):
    return spark.createDataFrame([
        # work
        ['how to make a python3 spark dataframe?', 'work'],
        ['swift objective-c inter operation', 'work'],
        ['bootstrapping deployment pipeline', 'work'],
        ['aws route 53 domain configuration', 'work'],

        # Teacher
        ['My students are not listening to me what do I do?', 'work'],

        # Boring things
        ['How do I get to the nearest airport', 'work'],
        ['Jobs around me', 'work'],
        ['Which industry should I work in', 'work'],

        # sexual
        ['How to use a dating website to get laid', 'sexual'],
        ['Nudist beach near me', 'sexual'],
        ['Were to buy a sex doll?', 'sexual'],

        # https://www.maxim.com/maxim-man/most-common-sex-questions-on-google-2017-9/
        ['Where is the G-spot?', 'sexual'],
        ['How to make a woman orgasm', 'sexual'],
        ['Can you get rid of herpes?', 'sexual'],
        ['How to get rid of genital warts', 'sexual'],
        ['How to get a bigger penis manually', 'sexual'],
        ['How to measure a penis', 'sexual'],
        ['How to insert a male organ into a female organ', 'sexual'],

        # Simple words for better bag of words model
        ['vagina', 'sexual'],
        ['penis', 'sexual'],
    ]).toDF("text", "label")


def political_samples(spark: SparkSession):
    return spark.createDataFrame([
        # work
        ['how to make a python3 spark dataframe?', 'work'],
        ['swift objective-c inter operation', 'work'],
        ['bootstrapping deployment pipeline', 'work'],
        ['aws route 53 domain configuration', 'work'],

        # Teacher
        ['My students are not listening to me what do I do?', 'work'],

        # Boring things
        ['How do I get to the nearest airport', 'work'],
        ['Jobs around me', 'work'],
        ['Which industry should I work in', 'work'],

        # https://www.ourmidland.com/news/article/Google-Trends-election-insights-17348435.php
        # I used the topics for inspiration, and came up with something from self
        ['Which presidential candidate has the best wages increase plan for the working class', 'political'],
        ['Protests against the government', 'political'],
        ['Sign petition against abortion', 'political'],
        ['why is inflation so high', 'political'],
        ['How can I persuade my spouse Donald trump is a good guy', 'political'],
        ['Latest dirt on president biden', 'political'],
        ['Why communism would never work in America', 'political'],
        ['How do we reach equal opportunity employment for minorities', 'political'],
        ['Find relative in a immigration detention center', 'political'],
        ['What is the government doing with homelessness, Los angeles budgets', 'political'],

        # Simple words for better bag of words model
        ['Elections', 'political'],
        ['Human rights', 'political'],
        ['amendment', 'political'],
        ['law', 'political'],
        ['homelessness', 'political'],
    ]).toDF("text", "label")


def illness_samples(spark: SparkSession):
    return spark.createDataFrame([
        # work
        ['how to make a python3 spark dataframe?', 'work'],
        ['swift objective-c inter operation', 'work'],
        ['bootstrapping deployment pipeline', 'work'],
        ['aws route 53 domain configuration', 'work'],

        # Teacher
        ['My students are not listening to me what do I do?', 'work'],

        # Boring things
        ['How do I get to the nearest airport', 'work'],
        ['Jobs around me', 'work'],
        ['Which industry should I work in', 'work'],
        ['Setting up an email campaign', 'work'],

        # illness
        ['My stomach hearts what should I do', 'illness'],
        ['Constant diarrhea after eating milk', 'illness'],
        ['What or first signs of cancer', 'illness'],
        ['doctors around me', 'illness'],
        ['Cant fall asleep do I have insomnia', 'illness'],
        ['Is everybody depressed?', 'illness'],
        ['spots on my body that wont go away', 'illness'],
        ['when should I go to a doctor after a headache', 'illness'],
        ['concussion side effects', 'illness'],
        ['mood stabilizers side effects', 'illness'],
        ['How to get rid of a cold', 'illness'],

        # Simple words for better bag of words model
        ['Melanoma', 'illness'],
        ['cancer treatment', 'illness'],
        ['herpes', 'illness'],
    ]).toDF("text", "label")


def top_n(learning_data: DataFrame, input_data: DataFrame, label: str, n: int):
    pipeline = classifier_pipeline(learning_data)
    labeled = run_classifier(pipeline, input_data, label)

    # I have been getting strange scores in scientific notation, drop them for now
    # Might as well drop all scores below 0.5
    without_outliers = labeled.where(
        col("confidence") > 0.5).where(col('confidence') <= 1)

    return (
        without_outliers
        .sort(desc('confidence'))
        .take(n)
    )


def top_n_searches_from_top_k_topics(n: int, k: int, input_data: DataFrame):
    """
    Will output top k searches closest to the each cluster center
    """

    # This code might have an issue of not fully representing your search query.
    # I suspect the fact that sentence embeddings is an array, each sentence has its own embedding.
    # For simplicity les just assume it's only one sentence and get the first element
    input_data_with_top_level_embeddings = input_data.withColumn(
        'simple_embedding', col('sentence_embeddings')[0].embeddings)

    # Trains a k-means model.
    kmeans = KMeans().setK(k).setFeaturesCol(
        "simple_embedding").setPredictionCol("cluster_center")
    model = kmeans.fit(input_data_with_top_level_embeddings)

    # Make predictions
    predictions = model.transform(input_data_with_top_level_embeddings)

    # Evaluate clustering by computing Silhouette score
    evaluator = ClusteringEvaluator(
        predictionCol='cluster_center', featuresCol='simple_embedding')

    silhouette = evaluator.evaluate(predictions)
    print("Silhouette with squared euclidean distance = " + str(silhouette))

    cluster_window = Window.partitionBy('cluster_center').orderBy(desc('text'))

    # desc(sqrt(expr('aggregate(transform(cluster_center, (element, idx) -> power(abs(element - element_at(init_vec, idx)), 2)), cast(0 as double), (acc, value) -> acc + value)'))))
    top_n_from_each_cluster = (
        predictions
        .withColumn('row_number', row_number().over(cluster_window))
        .where(col('row_number') <= n)
        .groupBy('cluster_center')
        .agg(f.collect_list('text').alias('top_n_searches'))
        .collect()
    )

    return top_n_from_each_cluster


def history_features(spark: SparkSession, history: DataFrame, per_feature_limit: int = 100):
    """Extracts a list of features, for now a single feature
    Example features:
    - Your top political searches
    - Main five topics you have searched for in the past year
    """
    history_dedup = dedup_top_n(
        history, 1, col('text'), expr('random()'))

    # Split the pipeline into stages
    # (1. Create text embeddings
    # 2. Create a classifier

    embedding_pipeline = bert_embeddings_pipeline()
    def add_embeddings(df: DataFrame): return embedding_pipeline.transform(df)

    # Call fit but hoping it is just a noop
    history_dedup_with_embeddings = add_embeddings(history_dedup)

    # top_n_searches = top_n_searches_from_top_k_topics(
    #     15,
    #     40,
    #     history_dedup_with_embeddings,
    # )

    # clusters = {}
    # for index, cluster in enumerate(top_n_searches):
    #     clusters[f"Cluster {index}"] = cluster.top_n_searches
    #     print(f"Cluster {index}")
    #     for search in cluster.top_n_searches:
    #         print(search)

    # Return typed list of features
    # Top N feature
    # Top Clusters
    # Timeline of searches

    features = {
        "Clearly nobody talked to you about 'the birds and the bees'. Thankfully you know where to go with these questions": top_n(
            add_embeddings(sexual_samples(spark)),
            history_dedup_with_embeddings,
            'sexual',
            per_feature_limit
        ),

        'Your quite an activist ... although we are unsure what party you are in just yet': top_n(
            add_embeddings(political_samples(spark)),
            history_dedup_with_embeddings,
            'political',
            per_feature_limit
        ),

        "I'm surprised you are not dead yet, these are the things you have searched for": top_n(
            add_embeddings(illness_samples(spark)),
            history_dedup_with_embeddings,
            'illness',
            per_feature_limit
        ),

        # "Here are the top 20 searches from your top 20 themes": [],
    }

    return features
