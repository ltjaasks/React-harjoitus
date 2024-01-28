import {
  BrowserRouter as Router,
  Routes, Route, Link
} from 'react-router-dom'

const Kommentti = ({comment}) => {
    return (
      <li><Link to={`/${comment.user}`}>{comment.user}</Link><br />
        {comment.comment}
      </li>
    )
  }

export default Kommentti