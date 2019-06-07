const puppeteer = require("puppeteer");

const scrapper = {
    fetchData: async url => {
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        // Load page
        await page.goto(url, { waitUntil: "networkidle0" });

        let countries = await page.$$('div[class*="col-md-4 country"]');
        let scrappedData = [] 

        for (let country of countries) {
            scrappedData.push({
                country: await country.$eval("h3", node =>
                    node.innerText.trim()
                ),
                capital: await country.$eval(
                    'div[class="country-info"] span[class="country-capital"',
                    node => node.innerText.trim()
                ),
                population: await country.$eval(
                    'div[class="country-info"] span[class="country-population"',
                    node => node.innerText.trim()
                ),
                area: await country.$eval(
                    'div[class="country-info"] span[class="country-area"',
                    node => node.innerText.trim()
                )
            });
        }
        return scrappedData
    }
};

module.exports = scrapper;
