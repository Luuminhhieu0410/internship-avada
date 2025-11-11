### Requirements
1. Use this Fake JSON API: https://jsonplaceholder.typicode.com/
2. Get data from all users from API above. You will get a list of 10 users.
3. Get all the posts and comments from the API. Map the data with the users array. The data format should be like this:
```javascript
const users = [
  {
    "id": 1,
    "name": "Leanne Graham",
    "username": "Bret",
    "email": "Sincere@april.biz",
    "comments": [
      {
        "id": 5,
        "postId": 1,
        "name": "vero eaque aliquid doloribus et culpa",
        "body": "harum non quasi et ratione\ntempore iure ex voluptates in ratione\nharum architecto fugit inventore cupiditate\nvoluptates magni quo et"
      },
      // More comments
    ],
    "posts": [
      {
        "id": 1,
        "title": "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
        "body": "quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto"
      }
      // More posts
    ]
  }
]
```
4. Filter only users with more than 3 comments.
5. Reformat the data with the count of comments and posts
```javascript
const users = [
  {
    "id": 1,
    "name": "Leanne Graham",
    "username": "Bret",
    "email": "Sincere@april.biz",
    "commentsCount": 12,
    "postsCount": 34
  },
  //more users
]
```
6. Who is the user with the most comments/posts?
7. Sort the list of users by the postsCount value descending?
8. Get the post with ID of 1 via API request, at the same time get comments for post ID of 1 via another API request. Merge the post data with format:
```javascript
const post = {
  "userId": 1,
  "id": 1,
  "title": "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
  "body": "quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto",
  "comments": [
    {
      "postId": 1,
      "id": 1,
      "name": "id labore ex et quam laborum",
      "email": "Eliseo@gardner.biz",
      "body": "laudantium enim quasi est quidem magnam voluptate ipsam eos\ntempora quo necessitatibus\ndolor quam autem quasi\nreiciendis et nam sapiente accusantium"
    },
    // More comments
  ]
}
```