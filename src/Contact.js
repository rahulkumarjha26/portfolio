import './Contact.css'
import {Link} from 'react-router-dom'


export default function Contact(){
    return (
        <div className='contact-wrapper'>
                <div className='back'><Link to='/' style={{textDecoration:'none',color:'white'}}><div className='show'>rahul.<div className='hide'>works</div></div></Link></div>
              
              <div className='contact-title'>
                  <h1>Let's make something great!</h1>
              </div>

              <div className='contact-section'>
                    <h1>Contact</h1>
                    <p className='p-m'>
                    I'm seeking out opportunities to collaborate with companies / agencies / individuals, not just work for them. I want to bring my collective design experience to the table where we can work together to solve real business-problems in a way that optimizes all of our respective experience and knowledge.
                    </p>
                    <p className='p-m'>
                    I want to avoid subjective pissing-matches, and favor open-minded collaborators where egos are out of the equation. If that all sounds about right, then lets for sure chat about how we can work together.
                    </p>
                    <p className='p-m'>
                    Feel free to reach out through any platforms bellow:
                    </p>
                    <p class='p-m'>
                         <a target='_blank' style={{color:'#EA0F1E',fontWeight:'500',textDecoration:'none'}} href='https://drive.google.com/file/d/1pF8LMshdF61cAt96ZwRdDNGwVdixRMyr/view'>rahulkumarjha26@gmail.com</a>
                     </p>
                     <p class='p-m'>
                         <a target='_blank' style={{color:'#EA0F1E',fontWeight:'500',textDecoration:'none'}} href='https://www.instagram.com/111sync/'>Instagram</a>
                     </p>
                     <p class='p-m'>
                         <a target='_blank' style={{color:'#EA0F1E',fontWeight:'500',textDecoration:'none'}} href='https://www.linkedin.com/in/rahul-j-743723118/'>LinkedIn</a>
                     </p>
                     <p class='p-m'>
                         <a target='_blank' style={{color:'#EA0F1E',fontWeight:'500',textDecoration:'none'}} href='https://www.facebook.com/rahulkumarjha26/'>Facebook</a>
                     </p>
                     <p class='p-m'>
                         <a target='_blank' style={{color:'#EA0F1E',fontWeight:'500',textDecoration:'none'}} href='https://auth.geeksforgeeks.org/user/rahuljha9'>geeksforgeeks</a>
                     </p>
                     <p class='p-m'>
                         <a target='_blank' style={{color:'#EA0F1E',fontWeight:'500',textDecoration:'none'}} href='https://github.com/rahulkumarjha26'>Github</a>
                     </p>
              </div>
        </div>
    )
}


