import {
  getAllUser,
  getCommentsByPostId,
  getPostDataById,
  getPostsByUserId,
} from "./src/utils/api";
import { UserFormat, UserMapping } from "./src/types/dto/User.dto";
import { CommentModel } from "./src/types/entities/comment";
import { Post } from "./src/types/entities/post";
import { User } from "./src/types/entities/user";
import { PostDTO } from "./src/types/dto/Post.dto";


export async function mapDataUser(): Promise<UserMapping[]> {
  const users: User[] = await getAllUser();

  const usersMapping = await Promise.all(
    users.map(async (user) => {
      const posts: Post[] = await getPostsByUserId(user.id);

      const comments: CommentModel[] = (
        await Promise.all(posts.map((p) => getCommentsByPostId(p.id)))
      ).flat();

      return {
        ...user,
        posts,
        comments,
      };
    })
  );

  return usersMapping;
}

export async function reformatUserData(): Promise<UserFormat[]> {
  const userMapping = await mapDataUser();
  return userMapping.map((user) => {
    return {
      ...user,
      comments: user.comments.length,
      posts: user.posts.length,
    };
  });
}

export async function mergePostAndCommentData(postId = 1): Promise<PostDTO | null> {
  const post = await getPostDataById(postId);
  if (!post) return null;

  const commentInPost = await getCommentsByPostId(postId);
  return { ...post, comments: commentInPost };
}

// user có lấy post có nhiều comment nhất
export async function mostCommentPerPost(): Promise<UserFormat | null> {
  const users: UserFormat[] = await reformatUserData();
  if (users.length === 0) return null;

  const userMostComment = users.reduce((acc, curr) => {
    return curr.comments > acc.comments ? curr : acc;
  });

  return userMostComment;
}

export async function filterUsersMoreThan3Comment(): Promise<UserFormat[]> {
  const users = await reformatUserData();
  return users.filter((user) => user.comments > 3);
}
//sắp xếp user theo số lượng bài viết giảm dần
export async function sortUsersByPostsCountDesc(): Promise<UserFormat[]> {
  const users = await reformatUserData();
  return users.sort((a, b) => b.posts - a.posts);
}