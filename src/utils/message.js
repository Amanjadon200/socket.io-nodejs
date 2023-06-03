const moment = require("moment/moment");

const message = (message,username) => {
    return {
        text: message,
        createdAt: moment(new Date().getTime()).format("h:mm a"),
        username
    };
};
module.exports={message}