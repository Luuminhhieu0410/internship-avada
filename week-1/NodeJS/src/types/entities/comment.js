"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentModel = void 0;
class CommentModel {
    constructor(id, postId, name, body) {
        this.id = id;
        this.postId = postId;
        this.name = name;
        this.body = body;
    }
}
exports.CommentModel = CommentModel;
