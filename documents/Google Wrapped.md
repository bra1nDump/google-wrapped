# Pitch

Google Wrapped baffles users with topics they have searched within the past 5 years or so. They can't wait to share this with their friends on social. Expected to have high virality.

# Key resources

Repository https://github.com/everythingwrapped/google-wrapped

# User flow:

- Lands on the page with the pitch and detailed screenshots explaining export from google
- They're sold. They follow the steps (next section)
- They get the email with their word clouds
- They share on social triggering a viral effect (think wordle, Isaiah)

# Unofficial team

- Code: Kirill, Isaiah
- Not sure yet: Maxim, Konstantin

# Tracker

🥼 - effort unit
👍 - self explanatory
🛑 - potential dealbreaker

1. Get the Takeout .zip file to our server somehow
   1. [v1] 🥼 Manual upload to server
   2. [v+] 🥼🥼🥼 Mobile friendly, share from google drive
2. 🥼 Server parses the content, simplifies data format
3. Data mining model generate
   1. [v0] 🥼 Bag of words
   2. [v1] 🥼🥼🥼 Themed clusters
   3. [v2] Configure theme: (Isaiah) sl2r from professional to degenerate
4. 🥼🥼 Render stats
5. 🥼 Deliver back to user

# User concerns

Anthony & Eugine
People don't know how much info Google stores
People are logged out
People are on safari
Z are not aware data is collected

Natasha
Concerns with what we think is funny. Needs more people deciding on what is funny. Needs representation.

# Ideas

#monetization

Cards against humanity ? find a good one and use
Play cards against humanity with your searches

- Expansion pack and print it out, monetize

# References

## Google's history user control

- See your activity: https://myactivity.google.com/myactivity
- Export activity to .zip (takeout): https://takeout.google.com/settings/takeout/downloads

## Google API documentation

- Watch shared with bot account: https://developers.google.com/drive/api/guides/push
- Auth overview https://developers.google.com/workspace/guides/auth-overview
- Official Google auth API nodejs https://cloud.google.com/nodejs/docs/reference/google-auth-library/latest

## Google project links

- Credentials (OAuth setup here) https://console.cloud.google.com/apis/credentials?project=wrapped-dev
- https://www.npmjs.com/package/google-trends-api#dailyTrends

# Related, Competition

- Year in search https://about.google/stories/year-in-search/
- Rigorously check for competition.
  - Searches attempted: Google wrapped, "personal" google trends, article that reviewed biggest re implementations of Spotify wrpped
  - Product hunt searched as well with similar terms

More checking definitely is due.

# Archive

## Get the Takeout .zip options:

Each process stars the same - with takeout. After this the options diverge. This divergence greatly? effects user experience and implementation path which in turn effects compliance with google's policies.

There is no Takeout API - not in Google's interest. https://www.reddit.com/r/gsuite/comments/s367gb/takeout_api_script_to_download_takeouts/

1. Wrapped (landing)
2. Google (export)
3. Wait for takeout email

### Share takeout file with takeout@wrappedbot.com service account

- Streamlined, each step follows from the previous one
- Easy results delivery
- 🛑 High risk for google verification (using elevated permissions for our bot account)
  - High risk google is not going to like what we're doing, or at the very least our domain name

4. From takeout email click link to open exported file in google drive
5. Share file with takeout@wrappedbot.com (need to remember address 👎)
6. Wait for wrapped email (view results)

Mitigations

- There might be a loophole we can use in google https://developers.google.com/terms/api-services-user-data-policy#additional_requirements_for_specific_api_scopes
  - Basically we are authenticating as a user from wrappedbot.com workspace, which we can associate with our application. In this case we should be able to grant this permission.
  - This is how we can authorize google wrapped in our bot workspace https://support.google.com/a/answer/7281227#zippy=%2Cbefore-you-begin-review-authorized-third-party-apps
  - https://admin.google.com/u/1/ac/owl/list?tab=configuredApps&hl=en-US&ecid=C02obptiig

### Wrapped oauth + google drive picker

- Need to go back and forth a lot
- Takes one step longer

1. Remember instructions or receive follow up from wrapped 👎
   1. For us to send the follow up we need to get the user's email
2. Wrapped (kick of authorization)
3. Google authorization using a file picker (need to remember which file to pick 👎)
4. Wrapped (view results in browser 👍)

Technical notes:

- UI + Server, typescript https://github.com/tomanagle/google-oauth-tutorial

### Paste to Wrapped the share link to take out archive

Cross language embeddings Google

https://ai.googleblog.com/2020/08/language-agnostic-bert-sentence.html?m=1

https://tfhub.dev/google/universal-sentence-encoder-multilingual-large/3

To mining colab ssh https://colab.research.google.com/github/JayThibs/jacques-blog/blob/master/_notebooks/2021-09-27-connect-to-colab-from-local-vscode.ipynb#scrollTo=7PPNdYB-

Codespaces container setup

https://dlite.cc/2020/05/26/github-codespaces-machine-learning.html

https://github.com/microsoft/vscode-dev-containers/issues/675

https://containers.dev/implementors/json_reference/

Don't approach as sales
Approach it as market research - interesting to know what feels weird to people
My own expectations - resentments

Dan
It would be fun
If that was private kind of thing. Privacy anonymity.

What would feel more private and anonymous:

- felt something they felt in control of
- some insurances - commitments
- code open source?
- do I want to do this - as coop or **us against the system**
- he will put more thought into it
