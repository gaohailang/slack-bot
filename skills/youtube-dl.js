const { execFile } = require("child_process");

module.exports = function(controller) {
  controller.hears(["^sub"], "direct_message,direct_mention", function(
    bot,
    message
  ) {
    const url = message.replace(/^sub\s/g, "");

    const child = execFile(
      __dirname + "../bin/diy-youtube-dl-sub.sh",
      [url],
      (error, stdout, stderr) => {
        if (error) {
          throw error;
          bot.reply(message, "something wrong in get sub for youtube");
        }
        console.log(stdout);
        bot.reply(message, stdout);
      }
    );
  });
};
