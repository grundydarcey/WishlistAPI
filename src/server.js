const app = require('./app');
const { PORT } = require('./config');
const browserObject = require('./browser');
const scraperController = require('./pageController');


app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});

let browserInstance = browserObject.startBrowser();

scraperController(browserInstance);