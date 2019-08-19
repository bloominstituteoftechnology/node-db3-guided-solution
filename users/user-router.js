const express = require('express');

const Users = require('./user-model.js');

const router = express.Router();

router.get('/', (req, res) => {
  // use find()
  // instead of querying db directly
  Users.find()
  .then(users => {
    res.json(users);
  })
  .catch(err => {
    res.status(500).json({ message: 'Failed to get users' });
  });
});

router.get('/:id', (req, res) => {
  const { id } = req.params;

  Users.findById(id)
  .then(user => {
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'Could not find user with given id.' })
    }
  })
  .catch (err => {
    res.status(500).json({ message: 'Failed to get user' });
  });
});

router.get('/:id/posts', (req, res) => {
  const { id } = req.params;

  Users.findPosts(id)
  .then(posts => {
    res.json(posts);
  })
  .catch(err => {
    res.status(500).json({ message: 'failed to get posts' });
  });
});

router.post('/', (req, res) => {
  const userData = req.body;

  Users.add(userData)
  .then(newUser => {
    res.status(201).json(newUser);
  })
  .catch(err => {
    res.status(500).json({ message: 'Failed to create new user' });
  });
});

router.put('/:id', (req, res) => {
  const { id } = req.params;
  const changes = req.body;
  
  // update here
  Users.update(changes, id)
  .then(user => {
    // and here
    if (user) {
      //and here
      res.json({ user });
    } else {
      res.status(404).json({ message: 'Could not find user with given id' });
    }
  })
  .catch (err => {
    res.status(500).json({ message: 'Failed to update user' });
  });
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;

  // update here
  Users.remove(id)
  .then(count => {
    if (count) {
      res.json({ removed: count });
    } else {
      res.status(404).json({ message: 'Could not find user with given id' });
    }
  })
  .catch (err => {
    res.status(500).json({ message: 'Failed to delete user' });
  });
});

module.exports = router;