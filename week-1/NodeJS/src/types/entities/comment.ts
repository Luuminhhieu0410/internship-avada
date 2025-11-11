export class CommentModel {
  constructor(
    public id: number,
    public postId: number,
    public name: string,
    public body: string
  ) {}
}
