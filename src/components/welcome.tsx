import React from 'react'
import { User } from '../types/types';

interface PropsType {
  user: User | null;
}


const Welcome = ({user}: PropsType) => {
  return (
    <div>
      <h3>{JSON.stringify(user)}</h3>
      </div>
  )
}

export default Welcome