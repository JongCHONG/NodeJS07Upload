import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

const User = () => {
  const { id } = useParams()
  const [file, setFile] = useState(null)
  const [user, setUser] = useState([])

  useEffect(() => {
    fetch(`http://localhost:5000/user/${id}`)
      .then(response => response.json())
      .then(data => setUser(data))
  }, [id])

  const handleFileChange = (e) => {
    setFile(e.target.files[0])
  }

  const handleSubmit = e => {
    e.preventDefault()

    const formdata = new FormData()
    formdata.append("photo", file, file.name)

    fetch(`http://localhost:5000/user/${id}/file`, {
      method: "post",
      body: formdata
    })
      .then(response => response.json())
      .then(data => {
        console.log(data)
      })
  }

  console.log(file)

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          onChange={handleFileChange}
        />
        <br />
        <button type="submit">Submit</button>
      </form>
      {/* {user.map(user => (
        <>
          <p>{user.name}</p>
          <img src={user.profile_picture} alt={user.name} />
        </>
      ))} */}
    </>
  )
}

export default User