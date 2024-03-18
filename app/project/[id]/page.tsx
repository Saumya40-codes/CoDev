import React from 'react'
import styles from './project.module.css'
import Navbar from '@/app/components/MainPage/Navbar/Navbar'
import Folder from '@/app/components/Folder/Folder'
import EditorMain from '@/app/components/Editor/EditorMain'

const project = ({ params }: { params: { id: string } }) => {
  return (
    <div className={styles.projBody}>
      <div className={styles.navb}>
      <Navbar />
      </div>
      <hr className={styles.ruler} />
      <div className={styles.projContent}>
        <Folder/>
        <EditorMain/>
      </div>
    </div>
  )
}

export default project
