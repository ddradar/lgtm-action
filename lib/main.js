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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const event_1 = require("./event");
const send_comment_1 = require("./send-comment");
const isLGTM = (comment) => !!comment && comment.toLowerCase() === 'lgtm';
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const eventName = process.env.GITHUB_EVENT_NAME;
            if (!event_1.isSupportedEvent(eventName)) {
                core.warning(`Not supported Event: ${eventName}`);
                return;
            }
            if (!process.env.GITHUB_REPOSITORY) {
                throw new Error('GITHUB_REPOSITORY is not set in an environment variable. This package only works with GitHub Actions.');
            }
            const token = core.getInput('token', { required: true });
            const imageUrl = core.getInput('image-url', { required: true });
            const repoOwner = process.env.GITHUB_REPOSITORY.split('/')[0];
            const repoName = process.env.GITHUB_REPOSITORY.split('/')[1];
            const hook = yield event_1.getEventWebhookAsync(eventName);
            if (!isLGTM(hook.comment)) {
                core.info('Comment is not LGTM.');
                return;
            }
            yield send_comment_1.sendCommentAsync(token, repoOwner, repoName, hook.issueNumber, `![LGTM](${imageUrl})`);
        }
        catch (error) {
            core.setFailed(error.message);
        }
    });
}
run();
