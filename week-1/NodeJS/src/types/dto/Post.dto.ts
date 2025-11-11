import { CommentModel } from "../entities/comment";
import { Post } from "../entities/post";

export type PostDTO = Post & {
    comments : CommentModel[]
}