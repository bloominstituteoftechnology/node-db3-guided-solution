const db = require('../data/db-config.js');

module.exports = {
  find,
  findById, 
  findPosts, 
  add, 
  update, 
  remove
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

async function add(user) {
  const [ id ] = await db('users').insert(user);

  // we can use our findById method
  return findById(id);
}

async function update(changes, id) {
  await db('users').where({ id }).update(changes);

  // returns new user
  return findById(id);
}

function remove(id) {
  // returns removed count
  return db('users').where({ id }).del();
}