import { BASE_URL } from "../const/constant";
import { CommentModel } from "../types/entities/comment";
import { Post } from "../types/entities/post";
import { User } from "../types/entities/user";

export async function getAllUser() {
  try {
    const res = await fetch(`${BASE_URL}/users`);
    if (!res.ok) throw new Error("http status code : " + res.status);
    const data: User[] = await res.json();
    return data;
  } catch (error) {
    console.log("api.ts >> ", error);
    return [];
  }
}

export async function getPostsByUserId(userId: number) {
  try {
    const res = await fetch(`${BASE_URL}/users/${userId}/posts`);
    if (!res.ok) throw new Error("http status code : " + res.status);
    const data: Post[] = await res.json();
    return data;
  } catch (error) {
    console.log("api.ts >> ", error);
    return [];
  }
}

export async function getCommentsByPostId(postId: number) {
  try {
    const res = await fetch(`${BASE_URL}/posts/${postId}/comments`);
    if (!res.ok) throw new Error("http status code : " + res.status);
    const data: CommentModel[] = await res.json();
    return data;
  } catch (error) {
    console.log("api.ts >> ", error);
    return [];
  }
}

export async function getPostDataById(postId: number): Promise<Post | null> {
  try {
    const res = await fetch(`${BASE_URL}/posts/${postId}`);
    if (!res.ok) throw new Error("http status code : " + res.status);
    const data: Post = await res.json();
    return data;
  } catch (error) {
    console.log("api.ts >> ", error);
    return null;
  }
}
