# Chica BOT

**Chica BOT** is an automated programs used to engage in social media, equipped with various functions to help users

## Quickstart

The easiest way to get started with **Chica BOT** is by deploying to Heroku. You can deploy it on Heroku for free using the one-click-deployment button below
    
[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/lordriyan/chica-bot)

Required Buildpacks :
- https://github.com/jontewks/puppeteer-heroku-buildpack.git

## Installation

- Clone this repository

    `git clone https://github.com/lordriyan/chica-bot.git`

- Install all required packages

    `npm install` or `yarn install`

- Rename _.env.example_ to _.env_ and fill out the field

- Run the app

    `yarn start`

## Try it on
Currently supported platforms are:

- WhatsApp : 

    Scan the QR Code with your WhatsApp

    ![WA Qr Code](readme_files/whatsapp.png)

- Telegram
    
    [@ArisuAI_Bot](https://t.me/ArisuAI_Bot/)

- Discord : 

    Arisu AI#2848

## Powered by

- [@open-wa/wa-automate-nodejs](https://github.com/open-wa/wa-automate-nodejs)
- [@wit-ai/node-wit](https://github.com/wit-ai/node-wit)