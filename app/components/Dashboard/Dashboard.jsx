'use client';

import React,{useState} from 'react'
import styles from './dashboard.module.css'
import CreateProject from '../CreateProject/CreateProject';

const DashboardContents = () => {

    const [createProject, setCreateProject] = useState(false);

  return (
    <div className={styles.dashBody}>
        {createProject && (
            <div className={createProject && styles.overlay || ''}>
            <CreateProject setCreateProject={setCreateProject} />
            </div>
        )}
        <div className={styles.newProj}>
            <span>
                Create a new Project
            </span>
            <button className={styles.createButton} onClick={()=> setCreateProject((prevClicked)=>!prevClicked)}>
                Create
            </button>
            <hr className={styles.ruler} />
        </div>
    </div>
  )
}

export default DashboardContents
