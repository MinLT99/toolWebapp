const puppeteer = require("puppeteer");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const fs = require("fs");
const { TOTP } = require("totp-generator");
const { executablePath } = require("puppeteer");
const User = require("../models/User");

const crawlFacebookData = async (req, res) => {
  const pageUrls = req.body.pageUrls;
  const browser = await puppeteer.launch({
    headless: false,
    args: ["--disable-gpu", "--window-size=800,800", "--disable-notifications"],
    userDataDir: "./userData",
    // add this
    executablePath: executablePath(),
  });
  // Khai báo các biến
  const uid = "100074746173302";
  const password = "125fsdfsASDW#@DSDS";
  const mfa = "K4WBJ5NRZ3TLOVLLLPFBPUMA4PA6UBWS";
  const cookie = "";
  const page = await browser.newPage();
  // Handle logging events
  await loginViaDebug(page, { uid, password, mfa, cookie });

  // Đọc dữ liệu từ file
  const reactionData = fs.readFileSync("./data/listProfile.txt", "utf8");
  const reactionUrlList = reactionData
    .trim()
    .split("\n")
    .map((el) => el.trim());

  let allResults = [];
  for (const link of pageUrls) {
    try {
      await page.goto(link, { waitUntil: "networkidle2" });
      await page.waitForTimeout(5000);

      const data = await collectDataFromPage(page, reactionUrlList);
      console.log(data);
      allResults.push(data);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
  await browser.close();
  console.log("Checked");
  res.json(allResults);
  console.log(allResults);
};

class LoginError extends Error {
  constructor(message) {
    super(message);
    this.name = "LoginError";
  }
}

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function click(page, CSS_selector, timeout = 10000) {
  try {
    await page.waitForSelector(CSS_selector, {
      visible: true,
      timeout: timeout,
    });

    await page.$eval(CSS_selector, (el) => el.click());
  } catch (error) {
    console.error(`click ${CSS_selector} timeout`);
    return;
  }
}

async function type(page, CSS_selector, content, config = {}) {
  try {
    let el = await page.waitForSelector(CSS_selector, {
      visible: true,
      timeout: 10000,
    });
    await el.type(content, { delay: 100 });

    if (config.end_with_CR) {
      await el.type(String.fromCharCode(10));
    }

    if (config.end_with_TAB) {
      await el.type(String.fromCharCode(9));
    }
  } catch (error) {
    console.error(`type ${CSS_selector} timeout`);
    return;
  }
}

async function loginViaDebug(page, data) {
  try {
    await page.goto("https://www.facebook.com");
    await sleep(3000);

    if (data.cookie) {
      await page.setCookie(...JSON.parse(data.cookie));
      await page.reload();
    } else {
      let CSS_selector = "input[type='text'][id='email']";
      await type(page, CSS_selector, data.uid);
      await sleep(2000);

      CSS_selector = "input[type='password'][id='pass']";
      await type(page, CSS_selector, data.password, { end_with_CR: true });

      CSS_selector = "input[type='text'][id='approvals_code']";

      try {
        await page.waitForSelector(CSS_selector, { timeout: 10000 });
      } catch (e) {
        return
      }

      let max_otp_attemp = 3;

      while (max_otp_attemp) {
        let { otp } = TOTP.generate(data.mfa);
        await type(page, CSS_selector, otp, { end_with_CR: true });
        await sleep(2000);

        try {
          await page.waitForSelector(CSS_selector, { timeout: 3000 });
          max_otp_attemp -= 1;
        } catch (e) {
          break;
        }
      }

      if (!max_otp_attemp) {
        throw new LoginError("Login failed");
      }

      CSS_selector = "button[type='submit'][id='checkpointSubmitButton']";

      try {
        await page.waitForSelector(CSS_selector, { timeout: 30000 });
      } catch {
        throw new LoginError("Login failed");
      }

      let submit_counter = 5;

      // eslint-disable-next-line no-constant-condition
      while (submit_counter) {
        await click(page, CSS_selector);
        await sleep(2000);
        submit_counter -= 1;

        try {
          if (
            await Promise.any([
              page.waitForSelector('svg[aria-label="Trang cá nhân của bạn"]', {
                timeout: 10000,
              }),
              page.waitForSelector('svg[aria-label="Your profile"]', {
                timeout: 10000,
              }),
            ])
          ) {
            break;
          }
        } catch (e) {
          console.log(e);
        }
      }
    }
  } catch (e) {
    console.error(e);
  }
}
async function collectDataFromPage(page, reactionUrlList) {
  const btnMostRelevant = await findAndClickButton(
    page,
    "Phù hợp nhất",
    'div[role="button"]'
  );
  if (btnMostRelevant) {
    await page.waitForTimeout(1000);

    const btnAllComments = await findAndClickButton(
      page,
      "Tất cả bình luận",
      'div[aria-hidden="false"] div[role="menuitem"] span'
    );
    if (btnAllComments) {
      await page.waitForTimeout(2000);

      await expandAllComments(page);
      let urlCmt = await extractCommentLinks(page);
      let urlRc = await extractReactionLinks(page);
      // let contentCmt = await getcontentCmt(page);
      let shareCount = await getShareCount(page);
      let combinedUrls = [...urlCmt, ...urlRc];

      return analyzeData(
        reactionUrlList,
        combinedUrls,
        urlRc,
        urlCmt,
        shareCount
      );
    }
  }
}
function analyzeData(
  user_info_list,
  reaction_url_list,
  urlFB,
  urlCmt,
  shareCount
) {
  let user_map = new Map();
  let user_url_list = [];

  user_info_list.map((el) => {
    let [url, fullname, donvi] = el.trim().split(",");
    user_map.set(url, { fullname, donvi, counter: 0 });
    user_url_list.push(url);
  });

  reaction_url_list.forEach((url) => {
    if (user_url_list.includes(url)) {
      user_map.get(url).counter += 1;
    }
  });

  let not_reactive_user = Array.from(user_map.entries())
    .filter(([key, value]) => value.counter == 0)
    .map(([key, value]) => `[${value.donvi}] ${value.fullname} (${key})`);

  let reactive_user = Array.from(user_map.entries())
    .filter(([key, value]) => value.counter > 0)
    .map(([key, value]) => `[${value.donvi}] ${value.fullname} (${key})`);

  let react_counter = 0;
  for (let item of user_map.values()) {
    react_counter += item.counter;
  }

  let donvi = {};
  Array.from(user_map.entries()).map(([key, value]) => {
    if (!Object.keys(donvi).includes(value.donvi)) {
      donvi[value.donvi] = 0;
    }
    donvi[value.donvi] += value.counter;
  });

  let nguoiNgoai = reaction_url_list.length - react_counter;
  return {
    chuatuongtac: not_reactive_user,
    datuongtac: reactive_user,
    thongke: donvi,
    tongtuongtac: reaction_url_list.length,
    tongtuongtacdonvi: react_counter,
    tongtuongtackhongthuocdonvi: nguoiNgoai,
    tongcamxuc: urlFB.length,
    tongbinhluan: urlCmt.length,
    tongdiem: tinhdiem(urlFB, urlCmt, shareCount),
  };
}

async function findAndClickButton(page, buttonText, cssClassName) {
  const button = await page.evaluateHandle(
    (buttonText, cssClassName) => {
      const buttons = Array.from(
        document.querySelectorAll(cssClassName)
      ).filter((el) => el.innerText.includes(buttonText));

      return buttons.length > 0 ? buttons[0] : null;
    },
    buttonText,
    cssClassName
  );

  if (button) {
    await button.click();
    console.log(`Clicked on button: ${buttonText}`);
  }
  return button;
}

async function expandAllComments(page) {
  try {
    await page.evaluate(() => {
      let btnList = Array.from(
        document.querySelectorAll('div[role="button"] span span[dir="auto"]')
      ).filter((el) => el.innerText.includes("Xem thêm"));
      if (btnList.length > 0) {
        btnList[0].click();
      }
    });
  } catch (error) {
    console.log(`Error expanding comments: ${error}`);
  } finally {
    await page.waitForTimeout(5000);
  }
}

async function extractCommentLinks(page) {
  return await page.$$eval('div div span a[aria-hidden="false"]', (elements) =>
    elements.map((link) => link.href.replace(/[\?&]comment_id.*/, ""))
  );
}

async function extractReactionLinks(page) {
  const button = await findAndClickButton(
    page,
    "Tất cả cảm xúc:",
    'div[role="button"]'
  );
  if (button) {
    await page.waitForTimeout(1000);
    await scrollToEnd(page);
    return await page.$$eval(
      'div[role="dialog"][aria-labelledby] span[dir="auto"] a[role="link"]',
      (elements) => elements.map((link) => link.href.split(/.__cft/)[0])
    );
  }
  return [];
}
async function getcontentCmt(page) {
  let contentCmt = await page.$$eval(
    "div span[lang] div div[style]",
    (elements) => {
      return elements.map((el) => el.textContent.trim());
    }
  );
  return contentCmt;
}
async function getShareCount(page) {
  const soluongShare = await page.$$eval(
    'div[role="button"][tabindex="0"] span[dir="auto"]',
    (content) => {
      return content.map((el) => el.textContent.trim())[0];
    }
  );
  return soluongShare;
}

function tinhdiem(urlFB, urlCmt, soluong_share) {
  let tongdiem_baiviet =
    urlFB.length + urlCmt.length * 2 + soluong_share.length * 4;
  return tongdiem_baiviet;
}
async function scrollToEnd(page) {
  let hasMoreData = true;
  let oldLength = 0;
  while (hasMoreData) {
    let elements = await page.$$(
      'div[role="dialog"][aria-labelledby] span[dir="auto"] a[role="link"]'
    );
    if (oldLength === elements.length) {
      hasMoreData = false;
    } else {
      oldLength = elements.length;
      elements[elements.length - 1].scrollIntoView();
      await page.waitForTimeout(1000 + Math.random() * 4000);
    }
  }
}
module.exports = {
  crawlFacebookData,
};
