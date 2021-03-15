const scraperObject = {
  //url: 'http://books.toscrape.com',
  url: 'https://www.amazon.com/hz/wishlist/ls/1UO6TMFIOI8EI/ref=nav_wishlist_lists_5?_encoding=UTF8&type=wishlist',
  async scraper(browser){
    let page = await browser.newPage();
    console.log(`Navigating to ${this.url}...`);
    // Navigate to the selected page
    await page.goto(this.url);
    // Wait for the required DOM to be rendered
    //await page.waitForSelector('.page_inner');
    await page.waitForSelector('#wishlist-page');
    // Get the link to all the required books

   // let urls = await page.$$eval('section ol > li', links => {
    let urls = await page.$$eval('div ul > li', links => {
     // console.log(links)
     // Make sure the book to be scraped is in stock
      //links = links.filter(link => link.querySelector('.a-price-while > i')/*.textContent !== "In stock"*/)
      // Extract the links from the data
     
      links = links.map(el => el.querySelector('.a-link-normal ::after').href)
      return links;
    });
    // Loop through each of those links, open a new page instance and get the relevant data from them
    let pagePromise = (link) => new Promise(async(resolve, reject) => {
      let dataObj = {};
      let newPage = await browser.newPage();
      await newPage.goto(link);
      dataObj['bookTitle'] = await newPage.$eval('#title_section > h1', text => text.textContent);
      dataObj['bookPrice'] = await newPage.$eval('#priceblock_ourprice', text => text.textContent);
      dataObj['noAvailable'] = await newPage.$eval('#acrCustomerReviewTest', text => {
      // Strip new line and tab spaces
      text = text.textContent.replace(/(\r\n\t|\n|\r|\t)/gm, "");
      // Get the number of stock available
      let regexp = /^.*\((.*)\).*$/i;
      let stockAvailable = regexp.exec(text)[1].split(' ')[0];      
      return stockAvailable;
    });
    dataObj['imageUrl'] = await newPage.$eval('#imgTagWrapperId img', img => img.src);
    dataObj['bookDescription'] = await newPage.$eval('.a-list-item', div => div.nextSibling.nextSibling.textContent);
    dataObj['upc'] = await newPage.$eval('.a-normala-spacing-micro > tbody > tr > td', table => table.textContent);
    resolve(dataObj);
    await newPage.close();
  });

  for(link in urls){
    let currentPageData = await pagePromise(urls[link]);
    // scrapedData.push(currentPageData);
    console.log(currentPageData);
  }
  }
}

module.exports = scraperObject;