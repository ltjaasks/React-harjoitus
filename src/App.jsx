import { createElement, useState, useEffect } from 'react'
import {
  BrowserRouter as Router,
  Routes, Route, Link, useParams,
  useNavigate
} from 'react-router-dom'
import Kommentti from './components/Comment'
import axios from 'axios'

const Home = (props) => (
  <div>
    <h2>Home</h2>
    <p>Small blog application to refresh memory on javascript and test some security problems that might occur in developing a React app.</p>
    <h3>Users</h3>
    <ul>
      {props.users.map((user) =>
        <li key={user.id}><Link to={`${user.username}`}>{user.username}</Link></li>
      )}
    </ul>
  </div>
)

const Profile = (props) => {
  return (
    <div>
      {createElement('h2', null, props.user.username)}
      <p id='userBio'>{props.user.bio}</p>
    </div>
  )
}

const Profile2 = ({users}) => {
  const username = useParams().username
  const user = users.find(n => n.username === String(username))
  
  var jsonParsed = null
  user.style
  ? jsonParsed = JSON.parse(user.style)
  : null
  
  return (
    <div>
      {createElement('h2', null, user.username)}
      {createElement('p', jsonParsed, user.bio)}
    </div>
  )
}

const Login = (props) => {
  const navigate = useNavigate()

  const onSubmit = (event) => {
    event.preventDefault()
    props.onLogin({username: event.target.username.value, password: event.target.password.value})
    navigate('/')
  }
  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={onSubmit} >
        <div>
          username: <input id='username' />
        </div>
        <div>
          password: <input type='password' id='password' />
        </div>
        <button type='submit'>login</button>
      </form>
    </div>
  )
}

// TO:DO siisti
const AddBlog = (props) => {
  const navigate = useNavigate()
  const addBlog = (event) => {
    event.preventDefault()
    const blogPostObject = {
      id: props.blogs.length + 1,
      title: event.target.title.value,
      content: event.target.content.value,
      comments: []
    }

    axios
      .post('http://localhost:3001/blogs', blogPostObject)
      .then(response => {console.log(response)})

    props.setBlogs(props.blogs.concat(blogPostObject))
    console.log(blogPostObject)
    navigate('/Blogs')
  }
  return (
  <div>
    <form onSubmit={addBlog}>
      <input id='title' placeholder='Blog title'></input>
      <br />
      <textarea rows="10" cols="50" id='content' placeholder='Blog content'></textarea>
      <br />
      <button type='submit'>Submit</button>
    </form>
  </div>
  )
}

const Blogs = (props) => {
  console.log('käyttäjä', props.user)
  console.log(location.href)
  return (
  <div>
    <h2>Blogs</h2>
    <ul>
      {props.blogs.map((blog) =>
        <li key={blog.id}><Link to={`/blogs/${blog.id}`}>{blog.title}</Link></li>
      )}
    </ul>
    {
      props.user
      ? <Link to="AddBlog">Write a blog</Link>
      : <p>Log in to write a blogpost</p>
    }
  </div>
  )
}

// TO:DO siisti
const WriteComment = ({blog, user}) => {
  const navigate = useNavigate()
  const addComment = (event) => {
    event.preventDefault()
    console.log('commentit 1', blog.comments)
    const commentObject = {
      id: blog.comments.length + 1,
      user: user.username,
      comment: event.target.content.value
    }
    blog.comments = [ ...blog.comments, commentObject ]
    console.log('commentit 2', blog.comments)
    navigate(`/blogs/${blog.id}`)
  }
  return(
    <form onSubmit={addComment}>
      <textarea id='content' rows="3" cols="40"></textarea>
      <br />
      <button type='submit'>Submit</button>
    </form>
  )
}

const Blog = ({ blogs, user }) => {
  const id = useParams().id
  const blog = blogs.find(n => n.id === Number(id))
  return (
    <div>
      <h2>{blog.title}</h2>
      <div dangerouslySetInnerHTML={{__html:blog.content}}></div>
      <h3>Comments</h3>
      {
        user
        ? <WriteComment blog={blog} user={user} />
        : <p>Log in to comment</p>
      }
      <ul>
      {
        blog.comments.map((comment) => <Kommentti key={comment.id} comment={comment}/>)
      }
      </ul>
    </div>
  )
}

const App = () => {
  const [users, setUsers] = useState([])
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)

  const testi = 'jotain'

  const padding = {
    padding: 5
  }

  useEffect(() => {
    console.log('effect')
    axios
      .get('http://localhost:3001/blogs')
      .then(response => {
        console.log('promise fulfilled')
        setBlogs(response.data)
      })
      axios
      .get('http://localhost:3001/users')
      .then(response => {
        console.log('promise fulfilled')
        setUsers(response.data)
      })
  }, [])

  console.log('kaikki käyttäjät', users)
  console.log('blogger', users.find(n => n.username === 'blogger123'))
  const blogger = users.find(n => n.username === 'blogger123')

  const login = (user) => {
    console.log('logged in', user)
    var loginUser = users.find(u => u.username === user.username && u.password === user.password)
    
    loginUser
    ? setUser(loginUser)
    : console.log('Wrong credentials')
  }

  return(
    <div>
      <Router>
        <div>
          <Link style={padding} to="/">Home</Link>
          <Link style={padding} to="Blogs">Blogs</Link>
          {
            user
            ? <Link style={padding} to="/Profile">My Profile</Link>
            : <Link style={padding} to="Login">Login</Link>
          }

          <Routes>
            <Route path='/blogs/:id' element={<Blog blogs={blogs} user={user} />} />
            <Route path='/blogs' element={<Blogs blogs={blogs} user={user} />} />
            <Route path='/login' element={<Login onLogin={login} />} />
            <Route path='/profile' element={<Profile user={user} />} />
            <Route path='/:username' element={<Profile2 users={users} />} />
            <Route path='/blogs/addblog' element={<AddBlog setBlogs={setBlogs} blogs={blogs} />} />
            <Route path='/' element={<Home users={users} />} />
          </Routes>
        </div>
      </Router>
    </div>
  )
}

export default App
