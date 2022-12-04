# Github Codespaces

Pricing https://docs.github.com/en/billing/managing-billing-for-github-codespaces/about-billing-for-github-codespaces

Codespaces Compute

2 core 1 hour $0.18
4 core 1 hour $0.36
8 core (16GB ram) 1 hour $0.72 - Preferred, others to small for spark to run :D
16 core 1 hour $1.44
32 core 1 hour $2.88

Codespaces Storage Storage 1 GB-month $0.07

[Github Codespaces ML](https://docs.github.com/en/codespaces/developing-in-codespaces/getting-started-with-github-codespaces-for-machine-learning)

Google Colab https://colab.research.google.com/github/JohnSnowLabs/spark-nlp-workshop/blob/master/jupyter/quick_start_google_colab.ipynb

With VSCode https://www.freecodecamp.org/news/how-to-use-google-colab-with-vs-code/

## jupyter

https://stackoverflow.com/questions/37890898/how-to-set-env-variable-in-jupyter-notebook
Get paths jupyter --paths

? set more env vars?
https://opensource.com/article/18/11/pyspark-jupyter-notebook
https://towardsdatascience.com/how-to-use-pyspark-on-your-computer-9c7180075617

Yep I think thats it :D

https://jupyter-client.readthedocs.io/en/stable/kernels.html#kernel-specs

BINGO
cat /home/codespace/.local/share/jupyter/kernels/python3/kernel.json

```json
{
  "argv": ["python", "-m", "ipykernel_launcher", "-f", "{connection_file}"],
  "display_name": "Python 3 (ipykernel)",
  "language": "python",
  "metadata": {
    "debugger": true
  },
  "env": {
    "PATH": "/usr/lib/jvm/java-8-openjdk-amd64/jre/bin/:$PATH",
    "JAVA_HOME": "/usr/lib/jvm/java-8-openjdk-amd64"
  }
}
```

FUUUCUCKCKCKK

FUUUUCK codespaces
https://coder.com/blog/coder-the-github-codespaces-alternative
https://www.gitpod.io/pricing

Git Pod worked like a charm .........
