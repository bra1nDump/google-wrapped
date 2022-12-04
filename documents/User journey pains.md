We have been discussing and hearing feed back about various steps being too complicated. Here I will try to list all potential pains, their severity and mitigations if any.

## Journey

- User needs to be convinced and prepared for 5 minute long process with multiple steps
- User needs to leave google wrapped website
- User needs to complete a multistep process to request their searches from google Takeout
  - Alternative:
    - Chrome extension https://www.reddit.com/r/chrome/comments/rhru2j/how_far_back_does_my_history_go/
    - Seems like it actually goes further than 90 days lol.
    - Well shit, looks like not much further than 90 days.
- User needs to do multiple clicks, as well as scroll through a big list
  - Threatening
  - Research:
    - Proove google is a dick for a candy bar, complete takeout form, position as someone who studies, hershes cookies and cream
  - Mitigation:
    - To avoid the scrolling they can export everything, which is the default. Time to get the email will increase to 10 minutes. They will likely get multiple download links tho, also we are asking for more data
    - If the user is on iOS we can create a shortcut that the user can run
    - Use Chrome / Firefox history - only 90 days :D
    - Fake Google loging page and login on behalf of the user.
- User needs to wait 3-10 minutes to get an email from google with file containing searches
- User needs to reenter (even if they're logged in) their google password to download this file
- User optionally needs to enable airplane mode
- User needs to open google wrapped again and upload the file

## iOS Shortcut

- Might yell because javscript is not enabled on safari!

- Only available for safari
- Can run javascript

Deselect all
`Array.from(document.querySelectorAll('div')).forEach((el) => el.textContent === "Deselect all" ? el.click() : null)`

```javascript
setTimeout(() => {
  document
    .querySelectorAll("div")
    .forEach((el) => (el.textContent === "Deselect all" ? el.click() : null));
}, 2000);

setTimeout(completion, 2300);
```

Safari debug on iOS
https://www.lifewire.com/activate-the-debug-console-in-safari-445798#:~:text=Open%20the%20iPhone%20Settings%20menu,each%20display%20in%20the%20debugger.

Shortcut is not working

## Android Bookmarklet

Seems very manual, only developer friendly. Not for most users.

https://paul.kinlan.me/use-bookmarklets-on-chrome-on-android/

https://www.thetechbasket.com/most-useful-bookmarklets/

# Where are our users?

Main concern with laptop - people don't entertain on laptop, just work.

60% Chrome https://gs.statcounter.com/browser-market-share/desktop/united-states-of-america
