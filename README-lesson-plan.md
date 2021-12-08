# Node DB3 Guided Project Solution

Guided project solution for **Node DB3** Module.

Starter code is here: [Node DB3 Guided Project](https://github.com/LambdaSchool/node-db3-guided).

## Prerequisites

- [SQLite Studio](https://sqlitestudio.pl/index.rvt?act=download) installed.
- [This Query Tool Loaded in the browser](https://www.w3schools.com/Sql/tryit.asp?filename=trysql_select_top).

## Starter Code

The [Starter Code](https://github.com/LambdaSchool/node-db3-guided) for this project is configured to run the server by typing `npm run server`. The server will restart automatically on changes.

## Introduce Module Challenge

Introduce the project for the afternoon. If they are done early, encourage them to study tomorrow's content and follow the tutorials on Canvas.

## Foreign Keys

Review foreign keys in Canvas. You may use [SQLTryIt](https://w3schools.com/Sql/tryit.asp?filename=trysql_select_top) as a visual tool as well.

## Join Statements

Open [SQLTryIt](https://w3schools.com/Sql/tryit.asp?filename=trysql_select_top).

Alternatively, you can demo using the Northwind database included inside the data folder, and SQLite Studio.

Pull up the products table. We can see that there are two foreign keys in this table, which doesn't allow us to easily see who the supplier is for each product. Run:

```sql
SELECT ProductName, SupplierName FROM products;
```

We get an error because there is no `SupplierName` in products. That field comes from `Suppliers`.

Instead write:

```sql
SELECT ProductName, SupplierName FROM Products
JOIN Suppliers ON Products.SupplierId = Suppliers.SupplierId;
```

Breakdown the syntax of this join statement.

### YOU DO (3 minutes)

Write a SQL statement to see `ProductName` and `CategoryName` and for each product.

One possible solution:

```sql
SELECT ProductName, CategoryName FROM Products
JOIN Categories ON Products.CategoryId = Categories.CategoryId;
```

### Aliases, Where, Order By

We could even combine two joins to see all three columns:

```sql
SELECT ProductName, SupplierName, CategoryName FROM Products
JOIN Suppliers ON Products.SupplierId = Suppliers.SupplierId
JOIN Categories ON Products.CategoryId = Categories.CategoryId;
```

Note that each joined table must link the the original table.

In these cases (and in joins in general) things can get wordy so we like to alias our table names

```sql
SELECT ProductName, SupplierName, CategoryName FROM Products as P
JOIN Suppliers AS S ON P.SupplierId = S.SupplierId
JOIN Categories AS C ON P.CategoryId = C.CategoryId;
```

Explain that join statements can also be used with other familiar SQL clauses like WHERE and ORDER BY:

```sql
SELECT ProductName, CategoryName, Price FROM Products as P
JOIN Categories AS C ON P.CategoryId = C.CategoryId
ORDER BY Price;
```

Add a WHERE statement

```sql
SELECT ProductName, CategoryName, Price FROM Products as P
JOIN Categories AS C ON P.CategoryId = C.CategoryId
WHERE Price < 20
ORDER BY Price;
```

**wait for students to catch up, use a `yes/no` poll to let students tell you when they are done**

### Types of Joins

Go into the `Categories` table and remove two records:

```sql
DELETE FROM Categories WHERE CategoryID = 1 OR CategoryId = 4;
```

Now run

```sql
SELECT ProductName, CategoryName FROM Products as P
JOIN Categories AS C ON P.CategoryId = C.CategoryId;
```

Notice that some products don't appear, because they are missing a category. This is called an `inner join` and is the default join in this environment. It only shows rows where records from **both** tables are represented.

If instead we wanted to see **all** records from our primary table (`products`), which is also called the `left table`, we could use a `left join`:

```sql
SELECT ProductName, CategoryName FROM Products as P
LEFT JOIN Categories AS C ON P.CategoryId = C.CategoryId;
```

Now all products are displayed.

Once finished, reset the database.

### Aggregate functions

If we wanted to know the cheapest product, we could always sort the data. But what if we wanted to know the cheapest product by category.

```sql
SELECT ProductName, CategoryId, min(Price) FROM Products
GROUP BY CategoryId;
```

Explain min and GROUP BY. Min is an aggregate functions (like `sum`, `count`, `min`, `avg`, `max`). Aggregate functions are often useful when working with multi table schemas, because we want to cluster records.

We often want to use aliases with aggregate functions as well.

```sql
SELECT ProductName, CategoryId, min(Price) as Price FROM Products
GROUP BY CategoryId;
```

### YOU DO (3 minutes)

Write a SQL statement to see a count of how many products are in each category.

One possible solution:

```sql
SELECT CategoryId, count(ProductName) as Count FROM Products
GROUP BY CategoryId;
```

**wait for students to catch up, use a `yes/no` poll to let students tell you when they are done**

**Take a break if it's a good time**

## Multi-Table APIs

Begin working with the guided demo. Show the students the `users` and `posts` tables in `SQLiteStudio`, emphasizing the foreign key in `posts`. Show them that we currently have CRUD endpoints for `users`. Adding Eslint to the project highly recommended: `npx eslint --init`.

### GET /api/users/:id/posts

We may want an endpoint to get all posts for a specific user:

```js
router.get('/:id/posts', checkUserId, (req, res, next) => {
  User.findPosts(req.params.id)
    .then(posts => {
      res.json(posts)
    })
    .catch(next)
})
```

Notice that the response does not include the username of the poster, which may be useful information. We can fix that with a knex join inside Users.findPosts.

```js
async function findPosts(user_id) {
  const rows = await db('posts as p')
    .join('users as u', 'u.id', 'p.user_id')
    .select('p.id as post_id', 'u.username', 'p.contents')
    .where({ user_id })
  return rows
}
```

Breakdown the syntax of the knex join. Point out the aliases. Explain why we have clarify `p.id` and `u.id`.

Hit the endpoint with postman or the browser to see the join statement in action.

**wait for students to catch up, use a `yes/no` poll to let students tell you when they are done**

### GET /api/users

Let's spice up this enpoint by having the User.find function resolve this structure:

```js
[
    {
        "user_id": 1,
        "username": "lao_tzu",
        "post_count": 6
    },
    {
        "user_id": 2,
        "username": "socrates",
        "post_count": 3
    },
    // etc
]
```

Walk learners through the solution, including the need to perform a left join so Hypatia won't be cropped out of the result set:

```js
async function find() {
  const rows = await db('users as u')
    .leftJoin('posts as p', 'u.id', 'p.user_id')
    .groupBy('u.id')
    .select('u.id as user_id', 'u.username')
    .count('p.id as post_count')
  return rows
}
```

### GET /api/users/:id

Let's improve this endpoint by making Users.findById resolve the following structure:

```js
{
  "user_id": 2,
  "username": "socrates"
  "posts": [
    {
      "post_id": 7,
      "contents": "Beware of the barrenness of a busy life."
    },
    // etc
  ]
}
```

Walk learners through the solution, including the need to perform a left join so Hypatia won't be cropped out of the result set:

```js
async function findById(id) {
  const rows = await db('users as u')
    .leftJoin('posts as p', 'u.id', 'p.user_id')
    .select(
      'u.id as user_id',
      'u.username',
      'p.id as post_id',
      'p.contents',
    )
    .where('u.id', id)

  // THE ROWS FROM THE DB SOMETIMES NEED FURTHER WORK!
  // We must use vanilla JS to hammer the data into the correct shape:
  let result = { posts: [] }
  for (let record of rows) {
    if (!result.username) {
      result.user_id = record.user_id
      result.username = record.username
    }
    if (record.post_id) {
      result.posts.push({
        contents: record.contents,
        post_id: record.post_id,
      })
    }
  }
  return result
}
```
