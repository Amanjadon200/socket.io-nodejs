const moment = require("moment/moment");

const message = (message) => {
    return {
        text: message,
        createdAt: moment(new Date().getTime()).format("h:mm a")
    };
};
module.exports={message}