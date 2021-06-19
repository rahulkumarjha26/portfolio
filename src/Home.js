import './Home.css'
import image from './my photo.jpg'
import React,{useState,useEffect} from 'react'
import { Link } from 'react-router-dom'
export default function Home(){
    
    const [tap,setTap] = useState(false)
   
    return (



    <div  className='wrapper'>

        <div className='link-wrapper'>
            {
                tap?
                <div className='link-container'>
                    <div className='link one'><Link style={{textDecoration:'none',color:'white'}} to='/About'><h1>About</h1></Link></div>
                    <div className='link two'><Link style={{textDecoration:'none',color:'#EA0F1E'}} to='/Work'><h1 >Work</h1></Link></div>
                    <div className='link three'><Link style={{textDecoration:'none',color:'#EA0F1E'}} to='/Contact'><h1>Contact</h1></Link></div>
                </div>
                :
                <div className='title-container'>
                    <div className='title x'><Link style={{textDecoration:'none',color:'white'}} to='/About'><h1 style={{color:'white'}}><div className='show'>Hello.</div><div className='hide'>About</div></h1></Link></div>
                    <div className='title y'><Link style={{textDecoration:'none',color:'white'}} to='/Work'><h1 style={{color:'#EA0F1E'}}><div className='show'>I am</div><div className='hide'>Work</div></h1></Link></div>
                    <div className='title z'><Link style={{textDecoration:'none',color:'white'}} to='/Contact'><h1 style={{color:'#EA0F1E'}}><div className='show'>Rahul</div><div className='hide'>Contact</div></h1></Link></div>
                </div>
            }
                
              
            
        </div>

        <div  className='image-wrapper'>
            <div>
                <img  className='image' src={image}></img>
            </div>
            
        </div>

        <div onClick={()=>tap?setTap(false):setTap(true)} className={tap?'tap':'tap active'}>
            <text>Tap anywhere</text>
        </div>
    </div>
    )
}

