const asyncHandler = require("express-async-handler");
const chat = require("../models/chat.js");
const user = require("../models/user.js");

// 1. Access or Create 1-on-1 Chat
const accessChats = asyncHandler(async (req, res) => {
    const { userId } = req.body;

    if (!userId) {
        console.log("UserId param not sent with request");
        return res.sendStatus(400);
    }

    var isChat = await chat.find({
        isGroupChat: false,
        $and: [
            { users: { $elemMatch: { $eq: req.user._id } } },
            { users: { $elemMatch: { $eq: userId } } },
        ]
    })
    .populate("users", "-password")
    .populate("latestMessage");

    isChat = await user.populate(isChat, {
        path: "latestMessage.sender",
        select: "name pic email"
    });

    if (isChat.length > 0) {
        res.send(isChat[0]);
    } else {
        var chatData = {
            chatName: "sender",
            isGroupChat: false,
            users: [req.user._id, userId],
        };

        try {
            const createdChat = await chat.create(chatData);
            const FullChat = await chat.findOne({ _id: createdChat._id }).populate("users", "-password");
            res.status(200).json(FullChat);
        } catch (error) {
            res.status(400);
            throw new Error(error.message);
        }
    }
});

// 2. Fetch All Chats for Sidebar
const fetchChats = asyncHandler(async (req, res) => {
    try {
        let results = await chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
            .populate("users", "-password")
            .populate("groupAdmin", "-password")
            .populate("latestMessage")
            .sort({ updatedAt: -1 });

        results = await user.populate(results, {
            path: "latestMessage.sender",
            select: "name pic email"
        });

        res.status(200).send(results);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});

// 3. Create Group Chat
const createGroupChat = asyncHandler(async (req, res) => {
    if (!req.body.users || !req.body.name) {
        return res.status(400).send({ message: "Please Fill all the fields" });
    }

    var users = JSON.parse(req.body.users); // Fixed JSON.paarse typo

    if (users.length < 2) {
        return res.status(400).send({ message: "More than 2 users are required to form a group chat" });
    }

    users.push(req.user);

    try {
        const groupChat = await chat.create({
            chatName: req.body.name,
            users: users,
            isGroupChat: true,
            groupAdmin: req.user,
        });

        const fullGroupChat = await chat.findOne({ _id: groupChat._id })
            .populate("users", "-password")
            .populate("groupAdmin", "-password");

        res.status(200).json(fullGroupChat);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});

// 4. Rename Group
const renameGroupChat = asyncHandler(async (req, res) => {
    const { chatId, chatName } = req.body;

    const updatedChat = await chat.findByIdAndUpdate(
        chatId,
        { chatName },
        { new: true }
    )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

    if (!updatedChat) {
        res.status(404);
        throw new Error("Chat Not Found");
    } else {
        res.json(updatedChat);
    }
});

// 5. Add User to Group
const addUserToGroup = asyncHandler(async (req, res) => {
    const { chatId, userId } = req.body;

    const added = await chat.findByIdAndUpdate(
        chatId,
        { $push: { users: userId } },
        { new: true }
    )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

    if (!added) {
        res.status(404);
        throw new Error("Chat Not Found");
    } else {
        res.json(added);
    }
});

// 6. Remove User from Group
const removeUserFromGroup = asyncHandler(async (req, res) => {
    const { chatId, userId } = req.body;

    const removed = await chat.findByIdAndUpdate(
        chatId,
        { $pull: { users: userId } },
        { new: true }
    )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

    if (!removed) {
        res.status(404);
        throw new Error("Chat Not Found");
    } else {
        res.json(removed);
    }
});

module.exports = {
    accessChats,
    fetchChats,
    createGroupChat,
    renameGroupChat,
    addUserToGroup,
    removeUserFromGroup
};