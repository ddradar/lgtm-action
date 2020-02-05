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
Object.defineProperty(exports, "__esModule", { value: true });
const rest_1 = require("@octokit/rest");
exports.sendCommentAsync = (token, owner, repo, issueNumber, comment) => __awaiter(void 0, void 0, void 0, function* () {
    const octokit = new rest_1.Octokit({
        auth: `token ${token}`
    });
    yield octokit.issues.createComment({
        owner,
        repo,
        issue_number: issueNumber,
        body: comment
    });
});
