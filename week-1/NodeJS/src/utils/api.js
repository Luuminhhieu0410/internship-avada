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
exports.getAllUser = getAllUser;
exports.getPostsByUserId = getPostsByUserId;
exports.getCommentsByPostId = getCommentsByPostId;
exports.getPostDataById = getPostDataById;
const constant_1 = require("../const/constant");
function getAllUser() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const res = yield fetch(`${constant_1.BASE_URL}/users`);
            if (!res.ok)
                throw new Error("http status code : " + res.status);
            const data = yield res.json();
            return data;
        }
        catch (error) {
            console.log("api.ts >> ", error);
            return [];
        }
    });
}
function getPostsByUserId(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const res = yield fetch(`${constant_1.BASE_URL}/users/${userId}/posts`);
            if (!res.ok)
                throw new Error("http status code : " + res.status);
            const data = yield res.json();
            return data;
        }
        catch (error) {
            console.log("api.ts >> ", error);
            return [];
        }
    });
}
function getCommentsByPostId(postId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const res = yield fetch(`${constant_1.BASE_URL}/posts/${postId}/comments`);
            if (!res.ok)
                throw new Error("http status code : " + res.status);
            const data = yield res.json();
            return data;
        }
        catch (error) {
            console.log("api.ts >> ", error);
            return [];
        }
    });
}
function getPostDataById(postId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const res = yield fetch(`${constant_1.BASE_URL}/posts/${postId}`);
            if (!res.ok)
                throw new Error("http status code : " + res.status);
            const data = yield res.json();
            return data;
        }
        catch (error) {
            console.log("api.ts >> ", error);
            return null;
        }
    });
}
