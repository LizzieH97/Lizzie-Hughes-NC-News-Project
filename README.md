# Northcoders News API

Hi there! So your code won't work unless you create the environment variables. Here's how: 

You'll need two new files within the main folder (i.e. just in be-nc-news) called ".env.developer" and ".env.test". In .env.developer you need to add: 

PGDATABASE=nc_news

This will be your main database where real-life information will be stored. Inside your .env.test you need to add:

PGDATABASE=nc_news_test

This is purely for testing, so that you don't accidentally leak sensitive information (or any information) and you can test your code in a smaller environment to identify errors in an easier manner. 

After this you'll need to run your setup.sql according to the commands in the endpoints.JSON file. 

Have fun! 


--- 

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
