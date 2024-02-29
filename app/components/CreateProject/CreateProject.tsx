import React from 'react'
import styles from './createproject.module.css'
import { CloseIcon } from '@chakra-ui/icons'

const CreateProject = ({setCreateProject}:{setCreateProject:React.Dispatch<React.SetStateAction<boolean>>}) => {
  return (
    <div className={styles.projnew}>
        <div className={styles.projmain}>
            <div className={styles.closeIcon}>
                <CloseIcon onClick={()=> setCreateProject((prevClicked)=>!prevClicked)} />
            </div>
            <div className={styles.projnewContent}>
                <span>
                    Project Name
                </span>
                <input type="text" placeholder="Enter Here..." className={styles.projnewInput} />
            </div>
            <div className={styles.projnewBtn}>
            <button className={styles.projBtn}>
                Go
            </button>
            </div>
        </div>
    </div>
  )
}

export default CreateProject
