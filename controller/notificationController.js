const { errorStatus500, bodyRequirer } = require("../errors");
const { notification } = require("../models/notificationModal");

// Method: GET; Description: Get notification by access_token
const get_notification = async ({ query: { access_token }, res }) => {
  try {
    const foundData = await notification.find({ belongs_to: access_token });
    if (!foundData)
      return res
        .status(400)
        .json({ message: "error", extraMessage: "Not found!" });

    return res.status(200).json({
      message: "success",
      data: foundData[0],
    });
  } catch (error) {
    errorStatus500(error, res);
  }
};

const send_invitation = async ({ query: { access_token }, body }, res) => {
  try {
    await bodyRequirer({ body, requiredValue: ["_id"] });

    const foundNotificationStack = await notification.find({
      belongs_to: body._id,
    });

    await notification.findByIdAndUpdate(foundNotificationStack[0]._id, {
      notification_stack: [
        {
          type: "invitation_stack",
          message: "Someone has sent an invitation!",
          user_id: access_token,
          time_stamp: new Date().getTime(),
        },
        ...foundNotificationStack[0].notification_stack.slice(0, 6),
      ],
    });

    return res.status(201).json({
      message: "success",
    });
  } catch (error) {
    errorStatus500(error, res);
  }
};

const followNotifier = ({ _id }) => {
  return {
    type: "follow_stack",
    message: "You have new follower!",
    user_id: _id,
    time_stamp: new Date().getTime(),
  };
};

module.exports = { get_notification, followNotifier, send_invitation };
