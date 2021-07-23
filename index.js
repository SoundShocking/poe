const puppeteer = require('puppeteer');
const moment = require('moment');
const fs = require('fs');
const cron = require('node-cron');
const axios = require('axios');

const links = [
  {
    url: 'https://poe.ninja/challenge/builds/char/Krazlam/Krazlam?i=1&search=name%3Dkraz',
    api: 'https://poe.ninja/api/data/1af22ec45e93ab33a4e51ba52dea29a7/GetCharacter?account=krazeee&name=%EB%A7%9D%EB%A0%B9%EB%88%88%EB%82%98&overview=ultimatum&type=exp&language=en',
    nick: 'xueta'
  },
  // {
  //   url: 'https://poe.ninja/challenge/builds/char/Krazlam/Krazlam?i=1&search=name%3Dkraz',
  //   nick: '228'
  // }
];

cron.schedule('*/20 * * * *', async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({
    width: 1250,
    height: 1080,
    deviceScaleFactor: 1
  })

  for (let i = 0; i < links.length; i++) {
    const link = links[i];

    await page.goto(link.url, {
      waitUntil: 'networkidle2',
    });

    await page.waitForTimeout(10000);

    if (!fs.existsSync(`./${link.nick}`)) {
      fs.mkdirSync(`./${link.nick}`)
    }

    await page.screenshot({ path: `./${link.nick}/${moment().format('DD.MM HH.mm.ss')}.png`, fullPage: true });

    const response = await axios.get(link.api);
    fs.writeFileSync(`./${link.nick}/${moment().format('DD.MM HH.mm.ss')}.txt`, response.data.pathOfBuildingExport);
  }

  await browser.close();
});