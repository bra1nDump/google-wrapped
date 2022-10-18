# Web server
Start with 
gunicorn --reload 'server:app'

# jupyter setup
Since I was not able to modify environment variables any other way, I'm starting to server myself. You can connect to it from the toggle on the vscode kernel selection menu. This is necessary to override java setup

jupyter server --config jupyter_kernel.json

Have attempted to teach a single classifier 
(the same one that we did for work and fun)
with multiple potential labels.
Unfortunately the results are underwhelming.
Seems to be a lot of misclassifications.

I think we're also going to hit the issue of
encoding properties of the search, instead of actual content.
For example how can you consider one search dumb?
I have asked if the earth is flat, 
and now it deems all climate and ecological questions
to be dumb.

# Gotchas
- To not shadow variable names!!!!!
I have received cryptic type error messages in notebooks because I would try to apply the same transformation to the same variable twice, second time inevitably it be failing