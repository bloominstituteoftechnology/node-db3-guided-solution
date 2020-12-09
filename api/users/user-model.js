const db = require('../../data/db-config.js');

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
  return db('posts as p')
    .join('users as u', 'u.id', 'p.user_id')
    .select('p.id', 'u.username', 'p.contents')
    // update to match param name
    .where({ user_id });
}

function add(user) {
  // returns an array with new user id
  return db('users').insert(user);
}

function update(changes, id) {
  db('users')
    .where({ id })
    .update(changes)
  .then(count => {
    // returns new user
    return findById(id);
  });
}

function remove(id) {
  // returns removed count
  return db('users').where({ id }).del();
}
