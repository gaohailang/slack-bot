const scrapeIt = require("scrape-it");
const assured = require("assured");
const request = require("request");
const cheerio = require("cheerio");

function _scrape(url, opts, cb) {
  cb = assured(cb);
  request(url, function(err, res, body) {
    if (err) {
      return cb(err);
    }
    const $ = cheerio.load(body);
    cb(null, scrapeIt.scrapeHTML($, opts), $, res, body);
  });
  return cb._;
}

// Promise interface
function query(q) {
  return _scrape(
    {
      url: `https://www.torrentkitty.tv/search/${encodeURI(q)}`,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.94 Safari/537.36",
        "upgrade-insecure-requests": "1",
        "cache-control": "no-cache"
      }
    },
    {
      title: "h1",
      // debug: {
      //   selector: "body",
      //   how: "html"
      // },
      items: {
        listItem: "#archiveResult tr",
        data: {
          title: "td.name",
          magnet_link: {
            selector: 'td.action a[rel="magnet"]',
            attr: "href"
          },
          date: "td.date",
          size: "td.size"
        }
      }
    }
  ).then(
    (page, $, res, body) => {
      console.log(page);
      // console.log(body);
      return page;
    },
    (err, page) => {
      console.log(err || page);
    }
  );
}

function formatMsg(items) {
  let attachments = [];
  items.forEach(i => {
    if (!i.title) return; // ignore fist head tr
    const { date, size, title } = i;
    attachments.push({
      text: `${title} ${date} ${size}`
    });
    attachments.push({
      text: i.magnet_link.split("&")[0]
    });
  });
  return {
    attachments
  };
}

module.exports = function(controller) {
  controller.hears(["^torrent (.*)"], "direct_message,direct_mention", function(
    bot,
    message
  ) {
    const q = message.match[1].trim();

    query(q)
      .then(d => {
        console.log(d);
        bot.reply(message, formatMsg(d.items));
      })
      .catch(e => {
        console.log(e);
        bot.reply(message, e);
      });
  });
};
