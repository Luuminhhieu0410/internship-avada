import { CommentModel } from "../entities/comment";
import { Post } from "../entities/post";
import { User } from "../entities/user";

export type UserMapping = User & {
  posts: Post[];
  comments: CommentModel[];
};

export type UserFormat = User & {
  posts: number;
  comments: number;
};