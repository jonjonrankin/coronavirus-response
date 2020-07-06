import React from 'react'
import { FaGithub, FaHeart } from 'react-icons/fa'

export default function About () {
  return (
    <div className='about'>
      <h1>About</h1>
      <p>
        COVID LENS is a project that 
        helps viewers visualize the trends in coronavirus 
        transmission around the United States.
      </p>
      <small><FaGithub /> <a href='https://github.com/jonjonrankin/coronavirus-response'>Collaborate</a> with me on GitHub - <FaHeart /> <a href='https://github.com/jonjonrankin/'>jonjonrankin</a></small>
    </div>
  )
}
