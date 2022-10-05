# jupyter setup
Since I was not able to modify environment variables any other way, I'm starting to server myself. You can connect to it from the toggle on the vscode kernel selection menu. This is necessary to override java setup

jupyter server --config jupyter_kernel.json


## Notes from the battlefield

>>> unknown2.show(20)
+--------------------+--------------------+--------------------+--------------------+--------------------+--------------------+
|                kind|                text|                 url|            document| sentence_embeddings|               class|
+--------------------+--------------------+--------------------+--------------------+--------------------+--------------------+
|             Visited|Your data in Sear...| https://myaccoun...|[{document, 0, 35...|[{sentence_embedd...|[{category, 0, 35...|
|            Searched|timeline of your ...|                    |[{document, 0, 31...|[{sentence_embedd...|[{category, 0, 31...|
|            Searched|       cloud of word|                    |[{document, 0, 12...|[{sentence_embedd...|[{category, 0, 12...|
|            Searched|      inventing anna|                    |[{document, 0, 13...|[{sentence_embedd...|[{category, 0, 13...|
|             Visited|Grow on Definitio...| https://www.goog...|[{document, 0, 45...|[{sentence_embedd...|[{category, 0, 45...|
|            Searched|origin of grew on...|                    |[{document, 0, 26...|[{sentence_embedd...|[{category, 0, 26...|
|            Searched|modern skyscraper...|                    |[{document, 0, 44...|[{sentence_embedd...|[{category, 0, 44...|
|            Searched|  modern skyscrapers|                    |[{document, 0, 17...|[{sentence_embedd...|[{category, 0, 17...|
|             Visited|Are LA's High-Ris...|                null|[{document, 0, 41...|[{sentence_embedd...|[{category, 0, 41...|
|            Searched|are la skyscraper...|                    |[{document, 0, 34...|[{sentence_embedd...|[{category, 0, 34...|
|Visited https://m...|                null|                null|[{document, 0, -1...|[{sentence_embedd...|[{category, 0, 21...|
|            Searched|earthquake 7 magn...|                    |[{document, 0, 21...|                  []|                  []|
|            Searched|how many children...|                    |[{document, 0, 31...|[{sentence_embedd...|[{category, 0, 31...|
|            Searched|how many children...|                    |[{document, 0, 39...|[{sentence_embedd...|[{category, 0, 39...|
|            Searched|google drive api ...|                    |[{document, 0, 43...|[{sentence_embedd...|[{category, 0, 43...|
|            Searched|how long google c...|                    |[{document, 0, 43...|[{sentence_embedd...|[{category, 0, 43...|
|Visited https://w...|                null|                null|[{document, 0, -1...|[{sentence_embedd...|[{category, 0, 34...|
|            Searched|google search dow...|                    |[{document, 0, 34...|                  []|                  []|
|            Searched|map of flood zone...|                    |[{document, 0, 31...|[{sentence_embedd...|[{category, 0, 31...|
|             Visited|Predictions of Fu...|                null|[{document, 0, 35...|[{sentence_embedd...|[{category, 0, 35...|
+--------------------+--------------------+--------------------+--------------------+--------------------+--------------------+

transform schema

>>> use_pipelineModel.transform(d).printSchema()
root
 |-- text: string (nullable = true)
 |-- document: array (nullable = true)
 |    |-- element: struct (containsNull = true)
 |    |    |-- annotatorType: string (nullable = true)
 |    |    |-- begin: integer (nullable = false)
 |    |    |-- end: integer (nullable = false)
 |    |    |-- result: string (nullable = true)
 |    |    |-- metadata: map (nullable = true)
 |    |    |    |-- key: string
 |    |    |    |-- value: string (valueContainsNull = true)
 |    |    |-- embeddings: array (nullable = true)
 |    |    |    |-- element: float (containsNull = false)
 |-- sentence_embeddings: array (nullable = true)
 |    |-- element: struct (containsNull = true)
 |    |    |-- annotatorType: string (nullable = true)
 |    |    |-- begin: integer (nullable = false)
 |    |    |-- end: integer (nullable = false)
 |    |    |-- result: string (nullable = true)
 |    |    |-- metadata: map (nullable = true)
 |    |    |    |-- key: string
 |    |    |    |-- value: string (valueContainsNull = true)
 |    |    |-- embeddings: array (nullable = true)
 |    |    |    |-- element: float (containsNull = false)
 |-- class: array (nullable = true)
 |    |-- element: struct (containsNull = true)
 |    |    |-- annotatorType: string (nullable = true)
 |    |    |-- begin: integer (nullable = false)
 |    |    |-- end: integer (nullable = false)
 |    |    |-- result: string (nullable = true)
 |    |    |-- metadata: map (nullable = true)
 |    |    |    |-- key: string // either work / fun
 |    |    |    |-- value: string (valueContainsNull = true)
 |    |    |-- embeddings: array (nullable = true)
 |    |    |    |-- element: float (containsNull = false)