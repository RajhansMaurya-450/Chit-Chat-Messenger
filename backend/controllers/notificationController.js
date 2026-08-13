const Notification = require("../Models/notificationModel");

const getNotifications = (async (req, res) => {
    const notifications = await Notification.find({
        recipient: req.user._id,
        isRead: false,
    })
        .populate("sender", "name email image")
        .populate("chat")
        .populate("message")
        .sort({ createdAt: -1 });

    res.json(notifications);
});

const markNotificationAsRead = async (req, res) => {
    try {
        const notification = await Notification.findOneAndUpdate(
            {
                _id: req.params.id,
                recipient: req.user._id,
            },
            {
                isRead: true,
            },
            {
                new: true,
            }
        );

        if (!notification) {
            return res.status(404).json({
                message: "Notification not found",
            });
        }

        res.json(notification);

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

module.exports = {
    getNotifications,
    markNotificationAsRead
};