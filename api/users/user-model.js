const db = require('../../data/db-config.js')

module.exports = {
  findPosts,
  find,
  findById,
  add,
  update,
  remove
}

async function findPosts(user_id) {
  const rows = await db('posts as p')
    .join('users as u', 'u.id', 'p.user_id')
    .select('p.id', 'u.username', 'p.contents')
    .where({ user_id })
  return rows
}

async function find() {
  const posts = await db('users as u')
    .leftJoin('posts as p', 'u.id', 'p.user_id')
    .select('u.id as user_id', 'u.username', 'p.id as post_id')
  let users = []
  for (let post of posts) {
    let user = users.find(u => u.username === post.username)
    if (user) {
      user.post_count++
    } else {
      users.push({
        user_id: post.user_id,
        username: post.username,
        post_count: post.post_id ? 1 : 0
      })
    }
  }
  return users
}

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

function add(user) {
  // returns an array with new user id
  return db('users').insert(user)
}

function update(changes, id) {
  return db('users')
    .where({ id })
    .update(changes)
    .then(count => { // eslint-disable-line
      return findById(id)
    })
}

function remove(id) {
  // returns removed count
  return db('users').where({ id }).del()
}
