import './Work.css'
import {Link} from 'react-router-dom'


export default function Work(){
    return(
        <div className='work-wrapper'>
                <div className='back'><Link to='/' style={{textDecoration:'none',color:'white'}}><div className='show'>rahul.<div className='hide'>works</div></div></Link></div>
            <div className='project-list'>
                {projects.map((project)=>{
                    return(
                    <a target='_blank' href={project.url} style={{textDecoration:'none'}}>
                        
                    <div className='project-wrap'>
                        
                        <h1>{project.name}</h1>
                        <p>{project.description}</p>
                    </div>
                    </a>
                    )
                })}
                
            </div>
        </div>
    )
}


const projects = [
    {
        name:'X-Hire',
        description:'AI recruitment Platform',
        url:'https://xhire-8c441.web.app/'
    
    },
    {
        name:'MBTi Test',
        description:'Voice Controlled Quiz',
        url:'https://mbti-3e319.web.app/'
    
    },
    {
        name:'Job Overflow',
        description:'Job Searching Portal',
        url:'https://joboverflow-9b58e.web.app/'
    },
    {
        name:'FaceTag',
        description:'Detects the faces in the picture',
        url:'https://rahulkumarjha26.github.io/facerecognition/'
    },
]