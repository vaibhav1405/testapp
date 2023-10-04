const puppeteer = require("puppeteer");
const data = require("./localstorage.json");
const app = require("express")();
let browser, page;
let setIntervalTiming = 3000;
const port = process.env.PORT || 8080;

app.get("/run", (req, res) => {
  console.log(req.query.url);
  pupp(req.query.url);
  res.send("running");
});
app.get("/", (req, res) => {
  res.send("running");
});
app.listen(port, () => {
  console.log("Server is running..." , port);
});
let previousName = "";
async function pupp(url) {
  try {
    // Launch Puppeteer and create a new page
    browser = await puppeteer.launch({
      headless: false,
      args: ["--no-sandbox"],
    });
    page = await browser.newPage();

    // Navigate to the URL
    await page.goto(`https://www.free4talk.com/room/${url}`);

    // Update localStorage with the provided JSON object
    const localStorageData = data;
    await page.evaluate((data) => {
      for (const [key, value] of Object.entries(data)) {
        localStorage.setItem(key, value);
      }
    }, localStorageData);
    await page.waitForSelector(".depLok");

    await page.click(".depLok");

    // You might want to add a small delay to allow the click action to take effect
    await page.waitForTimeout(1000);
    await page.waitForSelector(".ant-badge");

    await page.$eval(".ant-badge", (element) => element.click());

    setTimeout(()=>{ browser.close()}, 5000);
  
  } catch (err) {
    console.log(err);
  }
}
