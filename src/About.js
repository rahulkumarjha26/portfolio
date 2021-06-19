
import './About.css'
import React,{useState} from 'react';
import {Link} from 'react-router-dom'
import image from './photo2.jpg';
export default function About(){


    const [back,goBack] = useState(false)

    return <div className='about-container'>
                <div className='back'><Link to='/' style={{textDecoration:'none',color:'white'}}><div className='show'>rahul.<div className='hide'>works</div></div></Link></div>

             
                    <div className='about-title'>
                        <div><h2><div className='animate'>{'I design & build Web Apps'}</div></h2></div>
                    </div>
                    
                    
                    
                


                <div className='about-section'>
                <div className='image-container animate'>
                            <img src={image}></img>
                    </div>
                    <div className='detail-container'>
                    <h2>About</h2>
                    <p class="p-l">
                    Hi, I’m Rahul. I'm a multi-talented human with over 2+ years of experiences in wide range of design disciplines.
		           	</p>
                    <p class="p-m">
                    You can also call me a product designer, experience designer, interaction, UI, UX or by any other market defined function-title. I'm also a multi-disciplinary creater, developer, counsellor, front-end developer, music enthusiast, painter, podcaster and more.		  
                 	</p>
                     <p class="p-m">
                     I don’t like to define myself by the work I’ve done. I define myself by the work I want to do. Skills can be taught, personality is inherent. I prefer to keep learning, continue challenging myself, and do interesting things that matter.                 	</p>
                     <p class="p-m">
                     Fueled by high energy levels and boundless enthusiasm, I’m easily inspired and more then willing to follow my fascinations wherever they take me. I’m passionate, expressive, multi-talented spirit with a natural ability to entertain and inspire. I’m never satisfied to just come up with ideas. Instead I have an almost impulsive need to act on them.                 	</p>
                     <p class="p-m">
                     My abundant energy fuels me in the pursuit of many interests, hobbies, areas of study and artistic endeavors. I’m a fast learner, able to pick up new skills and juggle different projects and roles with relative ease.
                     </p>
                     <p class='p-m'>
                      <text>I like to develop expertise in a number of areas over the course of my life and career. My personality type is </text><a target='_blank' style={{color:'dodgerblue'}} href='http://www.personalitypage.com/INFP.html'>INFP</a><text>.  I currently work remotely with a selected freelance client base and are open for new opportunities.</text>
                     </p>
                     <p class='p-m'>
                     You can read more about my experience, skills, education and much more in the PDF attached bellow:
                     </p>

                     <p class='p-m'>
                         <a className='resume' target='_blank' style={{color:'#EA0F1E',textDecoration:'none'}} href='https://drive.google.com/file/d/1pF8LMshdF61cAt96ZwRdDNGwVdixRMyr/view'>My resume (pdf 109kb)</a>
                     </p>
                     </div>
                     
                </div>
          </div>
}
