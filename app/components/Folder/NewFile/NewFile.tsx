import React from 'react'
import { EmailIcon } from '@chakra-ui/icons'
import styles from './newfile.module.css'

const NewFile = () => {
  return (
    <div className={styles.newfile}>
      <div>
        <EmailIcon />
      </div>
        <div className={styles.newfileInp}>
            <input type="text" placeholder="Enter file name" />
        </div>
    </div>
  )
}

export default NewFile
