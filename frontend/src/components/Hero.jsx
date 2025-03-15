import React from 'react'
import { assets } from '../assets/assets'

const Hero = () => {
  return (
    <div className='flex flex-col sm:flex-row border border-gray-400'>
      {/* Hero Left Side */}
      <div className='w-full sm:w-1/2 flex items-center justify-center py-10 sm:py-0'>
            <div className='text-[#414141] text-center max-w-md'>
                <div className='flex items-center gap-2 justify-center'>
                    <p className='w-8 md:w-11 h-[2px] bg-[#414141]'></p>
                    <p className=' font-medium text-sm md:text-base'>WELCOME TO BEAR COMMERCE</p>
                </div>
                <h1 className='prata-regular text-3xl sm:py-3 lg:text-5xl leading-relaxed'>Where UCR Students Buy & Sell Anything</h1>
                <div className='flex items-center gap-2 justify-center'>
                    <p className='font-semibold text-sm md:text-base'>Join the campus community for easy deals</p>
                    <p className='w-8 md:w-11 h-[1px] bg-[#414141]'></p>
                </div>
            </div>
      </div>
      {/* Hero Right Side */}
      <img className='w-full sm:w-1/2' src={assets.scotty_img} alt="" />
    </div>
  )
}

export default Hero
