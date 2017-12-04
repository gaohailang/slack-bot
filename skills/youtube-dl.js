var spawn = require("child_process").spawn;

module.exports = function(controller) {
  controller.hears(["^sub (.*)"], "direct_message,direct_mention", function(
    bot,
    message
  ) {
    const url = message.match[1].replace(/[<>]/g, "");

    const ls = spawn(__dirname + "/../bin/diy-youtube-dl-sub.sh", [url], {
      cwd: __dirname + "/../bin"
    });
    let out = "";
    ls.stdout.on("data", function(data) {
      const s = data.toString();
      out += s;
      console.log("stdout: " + s);
    });

    ls.stderr.on("data", function(data) {
      const s = data.toString();
      out += s;
      console.log("stderr: " + s);
    });

    ls.on("exit", function(code) {
      const s = code.toString();
      out += s;
      console.log("child process exited with code " + s);

      bot.reply(message, out);
    });
  });
};
