var Mailgun = require('mailgun').Mailgun
	, mg = new Mailgun('key-9m8khz3xtf7yz8tkgn05c0yeoed5mtw3');

exports.sendMail = function (from, to, subject, body) {
	mg.sendText(from, [to], subject, body);
};

exports.gun = mg;
