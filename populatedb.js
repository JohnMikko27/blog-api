const User = require('./models/user')
const Post = require('./models/post')
const Comment = require('./models/comment')
require('dotenv').config();

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const mongoDB = process.env.MONGODB_URI

main().catch((err) => console.log(err));
async function main() {
  console.log('This populates my db with dummy data')
  console.log('Connecting...')
  await mongoose.connect(mongoDB);
  await createUsers()
  await createComments()
  await createPosts()
  console.log('Closing db...')
  mongoose.connection.close()
}

const users = []
const comments = []

async function userCreate(username, password, isAuthor) {
    const user = new User({ username, password, isAuthor})
    await user.save()
    console.log(`Created user with username: ${username}`)
    users.push(user)
}

async function commentCreate(text, date, user) {
    const comment = new Comment({text, date, user})
    await comment.save()
    console.log(`Created comment with text: ${text}`)
    comments.push(comment)
}   

async function postCreate(title, text, date, isPublished, comments, user) {
    const post = new Post ({
        title,
        text,
        date,
        isPublished,
        comments,
        user
    })
    await post.save()
    console.log(`Created post with title: ${title}`)
}

async function createUsers() {
    console.log('Adding users...')
    await Promise.all([
        userCreate('johndoe', 'pw', false),
        userCreate('janesmith', 'pw', true),
    ])
}

async function createComments() {
    console.log('Adding comments...')
    await Promise.all([
        commentCreate('this lobby stinks', '2024-06-08', users[0]),
        commentCreate('sure buddy', '2020-02-20', users[1])
    ])
}

async function createPosts() {
    console.log('Adding posts...')
    await Promise.all([
        postCreate('First post', 'not sure what to put for text', '1900-01-01', true, [comments[0], comments[1]], users[0]),
        postCreate('second post', 'placeholder text', '2000-01-01', false, [comments[0], comments[1]], users[1])
    ])
}