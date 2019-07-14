# Web DB III Guided Project Solution

Guided project solution for **Web DB III** Module.

Starter code is here: [Web DB III Guided Project](https://github.com/LambdaSchool/webdb-iii-guided).

## Prerequisites

- [SQLite Studio](https://sqlitestudio.pl/index.rvt?act=download) installed.
- [This Query Tool Loaded in the browser](https://www.w3schools.com/Sql/tryit.asp?filename=trysql_select_top).

## Starter Code

The [Starter Code](https://github.com/LambdaSchool/webdb-iii-guided) for this project is configured to run the server by typing `yarn server` or `npm run server`. The server will restart automatically on changes.

## How to Use this Repository

- clone the [starter code](https://github.com/LambdaSchool/webapi-iii-guided).
- create a solution branch: `git checkout -b solution`.
- add this repository as a remote: `git remote add solution https://github.com/LambdaSchool/webdb-iii-guided-solution`
- pull from this repository's `master` branch into the `solution` branch in your local folder `git pull solution master:solution --force`.

A this point you should have a `master` branch pointing to the student's repository and a `solution` branch with the latest changes added to the solution repository.

When making changes to the `solution` branch, commit the changes and type `git push solution solution:master` to push them to this repository.

When making changes to the `master` branch, commit the changes and use `git push origin master` to push them to the student's repository.

## Introduce Module Challenge

Introduce the project for the afternoon. If they are done early, encourage them to study tomorrow's content and follow the tutorials on TK.

## Foreign Keys

Review foreign keys in TK. You may use [SQLTryIt](https://w3schools.com/Sql/tryit.asp?filename=trysql_select_top) as a visual tool as well.

## Join Statements

Open [SQLTryIt](https://w3schools.com/Sql/tryit.asp?filename=trysql_select_top). 

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

#### YOU DO (3 minutes)

Write a SQL statement to see `ProductName` and `CategoryName` and for each product.

One possible solution:

```sql
SELECT ProductName, CategoryName FROM Products
JOIN Categories ON Products.CategoryId = Categories.CategoryId;
```

Note that each joined table must link to the original table. 

In 

### Aliases, Where, Order By

We could even combine two joins so see all three columns:

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

Go into the `categories` table and remove two records: 

```sql
DELETE FROM Categories WHERE CategoryID = 1 OR CategoryId = 4;
```

Now run

```sql
SELECT ProductName, CategoryName FROM Products as P
JOIN Categories AS C ON P.CategoryId = C.CategoryId;
```

Notice that some products don't appear, because they are missing a category. This is called an `inner join` and is the default join in this environment. It only shows rows where records from **both** tables are represented. 

If instead we wanted to see **all** records from our first primary (`products`), which is also called the `left table` in a join statement, we could use a `left join`:

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

#### YOU DO (3 minutes)

Write a SQL statement to see a count of how many products are in each category.

One possible solution:

```sql
SELECT CategoryId, count(ProductName) as Count FROM Products
GROUP BY CategoryId;
```

**wait for students to catch up, use a `yes/no` poll to let students tell you when they are done**

**Take a break if it's a good time**

## Multi-Table APIs

Begin working with the guided demo. Show the students the `users` and `posts` tables in `SQLiteStudio`, emphasizing the foreign key in `posts`. Show them that we currently have CRUD endpoints for `users`. 


### GET /api/users/:id/posts

We may want an endpoint to get all posts for a specific user:

```js
  router.get('/:id/posts', async (req, res) => {
    const { id } = params;

    try {
      const posts = await db('posts').where({ user_id: id });

      res.json(posts);
    } catch (err) {
      res.status(500).json({ message: 'failed to get posts' });
    }
  });
```

Notice that the response does not include the username of the poster, which may be useful information. We can fix that with a knex join.

```js
  const posts = await db
    .select('posts.id', 'username', 'contents')
    .from('posts')
    .join('users', 'users.id', 'posts.user_id').where({ user_id: id });
```

Breakdown the syntax of the knex join. Explain why we have clarify `posts.id` and `users.id`.

Hit the endpoint with postman or the browswer to see the join statement in action. 

**wait for students to catch up, use a `yes/no` poll to let students tell you when they are done**


## DB Access 

We've writing our knex logic directly into the route handlers. This isn't best practice. It's best to separate out all database code in the **database access files** (also called **models**). 

We've already worked with these types of file in the previous sprint. 

Create `./users/user-model.js` file and add the following.

```js
// database connection via knex
const db = require('../data/db-config.js');

module.exports = {

}
```

We can now begin to move all database logic into database access methods. 

```js
module.exports = {
  find
}

function find() {
  return db('users');
}
```

And then update the endpoint in `./users/users-router.js`

```js
//add import statement near top
const Users = require('./user-model.js');

...

router.get('/', async (req, res) => {
  try {
    // use find() 
    // instead of querying db directly
    const users = await Users.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get users' });
  }
});

```

Our goal is to completely remove database logic from the router file. List the other methods we would need. 

```js
module.exports = {
  find,
  // findById, 
  // findPosts, 
  // add, 
  // update, 
  // remove
}
```

Write the other find methods

```js
module.exports = {
  find,
  findById, 
  findPosts, 
  // add, 
  // update, 
  // remove
}

function find() {
  return db('users');
}

function findById(id) {
  // introduce first()
  // we can return a single user object
  // instead of an array
  return db('users').where({ id }).first()
}


function findPosts(user_id) {
  // copy code from GET /api/users/:id/posts
  return db
    .select('posts.id', 'username', 'contents')
    .from('posts')
    .join('users', 'users.id', 'posts.user_id')
     // update to match param name   
    .where({ user_id });
}
```

#### YOU DO (5 minutes)

Refactor `GET /api/users/:id` and `GET /api/users/:id/posts` to use the new access methods.

One possible solution:

```js
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // update here
    const user = Users.findById(id);
    ...
  } catch (err) {
    res.status(500).json({ message: 'Failed to get user' });
  }
});

router.get('/:id/posts', async (req, res) => {
  const { id } = req.params;

  try {
    // update here
    const posts = await Users.findPosts(id);
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: 'failed to get posts' });
  }
});

```

**wait for students to catch up, use a `yes/no` poll to let students tell you when they are done**

Write the add function next.

```js
function add(user) {
  // returns an array with new user id
  return db('users').insert(user);
}
```

We may wish instead to return the new users.

```js
async functon add(user) {
  const [ id ] = await db('users').insert(user);

  // we can use our findById method
  return findById(id);
}
```

In the router file:

```js
router.post('/', async (req, res) => {
  const userData = req.body;

  try {
    // update here
    const newUser = Users.add(userData);
    // and here
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create new user' });
  }
});
```

#### You Do (5 minutes) - Optional (10 minutes remaining)

Write `update()` and `remove()` and refactor the router to use them.

One possible solution:

```js
async function update(changes, id) {
  await db('users').where({ id }).update(changes);

  // returns new user
  return findById(id);
}

function remove(id) {
  // returns removed count
  return db('users').where({ id }).del();
}
```

In the router:

```js
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const changes = req.body;

  try {
    // update here
    const user = await Users.update(changes, id);

    // and here
    if (user) {
      //and here
      res.json({ user });
    } else {
      res.status(404).json({ message: 'Could not find user with given id' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Failed to update user' });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // update here
    const count = await Users.remove(id);
    ...
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete user' });
  }
});
```

We can remove `const db = require('../data/dbConfig.js)` from our `users-router` file. 