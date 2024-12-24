# YATB-Site
This is a website server to handle yatb's transcript uploading to self host the transcripts.

# Setup
1. Go to the [Discord developer panel](https://discord.com/developers)
2. Create an application
3. Go to the Oauth2 tab
4. Add a redirect to https://`domain`/discord
5. Add the ID and client secret in the `.env` file
7. Fill out all the other `.env` file properties (`AUTH_KEY` on the server and in the bot need to be the same!)
8. Add all sorting options (ticket types) to the index.html file on line 31 (Value should be the name of the category of the ticket)
9. Run `npm i` to install all the dependencies
10. Run `npm start` to build the project and run it
