"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const util_1 = require("util");
const supportedEvent = [
    'issue_comment',
    'pull_request_review'
];
exports.isSupportedEvent = (eventName) => !!eventName && supportedEvent.includes(eventName);
exports.getEventWebhookAsync = (eventName) => __awaiter(void 0, void 0, void 0, function* () {
    if (!process.env.GITHUB_EVENT_PATH) {
        throw new Error('GITHUB_EVENT_PATH is not set in an environment variable. This package only works with GitHub Actions.');
    }
    const jsonString = yield util_1.promisify(fs_1.default.readFile)(process.env.GITHUB_EVENT_PATH, 'utf-8');
    const webhookObject = JSON.parse(jsonString);
    switch (eventName) {
        case 'issue_comment': // https://developer.github.com/v3/activity/events/types/#issuecommentevent
            return {
                comment: webhookObject.comment.body,
                issueNumber: webhookObject.issue.number
            };
        case 'pull_request_review': // https://developer.github.com/v3/activity/events/types/#pullrequestreviewevent
            return {
                comment: webhookObject.review.body,
                issueNumber: webhookObject.pull_request.number
            };
    }
});
