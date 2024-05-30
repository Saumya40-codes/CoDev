'use client'

import React from 'react'
import styles from './terminal.module.css'
import { TypeAnimation } from 'react-type-animation';
import { useAppSelector } from '@/app/lib/redux/hooks';

const Terminal = () => {

  const currentFile = useAppSelector((state) => state?.file.currentFile);
  const output = currentFile && useAppSelector((state) => state?.file.output[currentFile]);

  return (
    <div className={styles.terminal}>
      <div className={styles.welc}>
        <TypeAnimation 
        sequence={[
          `Welcome to COdev!`,
        ]}
        speed={50}
        style={{ fontSize: '1.5em', paddingRight: '20px'}}
        />
      </div>
     {currentFile && output && (
        <div>
          <TypeAnimation 
          key={output}
          sequence={[
            `Output: ${output}`
          ]}
          speed={50}
          style={{ fontSize: '1em', paddingLeft: '10px'}}
          />
        </div>
     )}
    </div>
  )
}

export default Terminal
