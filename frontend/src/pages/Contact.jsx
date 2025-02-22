import React from 'react'

const Contact = () => {
  return (
    <div>
      <div className= 'text_center text-2xl pt-10 border-t'>
        <Title text1= {'CONTACT'} text2= {'US'}/>
      </div>

      <div className= 'my-10 flex flex-col justify-center md:flex-row gap-10 mb-29'>
        <img className= 'w-full md:max-w-[480px]' src= {assests.contanct.img} alt= ""/>
        <div className= 'flex flex-col justify-center items-start gap-6'>
          <p className= 'font-semibold text-xl text-grat-600'> Our Store</p>
          <p className= 'text-gray-500'> addy <br/>addy</p>
          <p className= 'text-gray-500'>Tel: 123-456-789 <br/> Email:hello@gmail.com</p>
          <p className= 'font-semibold text-xl text-gray-600'>Text </p>
          <p className= 'text-gray-500'> Text about web</p>
          <button className= 'border border-black px-8 py-4 text-sm hover: bg-black hover: text-white transition-all duration-500'> Explore </button>
                
          <NewsletterBox/>
          
          
           </div>
        

      </div>



      
    </div>
  )
}

export default Contact
