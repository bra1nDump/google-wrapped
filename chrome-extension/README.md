Copied from https://github.com/GoogleChrome/chrome-extensions-samples/tree/main/mv2-archive/api/history/showHistory

When pressing Command+Y more than ninety days of history's is displayed.

In the extension we are using history.search API that only returns up to ninety days. I have tested this by pushing the limit up to ninety and then beyond using this variable `maxDaysBack` in this directory's example code
