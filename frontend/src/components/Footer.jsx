import React from 'react'

const Footer = () => {
  return (
    <div>
      <div classname ='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>
        <div>
            <img src={assets.logo} className='mb-5 w-32' classalt="" />
            <p className='w-full md:w-2/3 text-gray-600'>
             Lorem ipsum dolor, sit amet consectetur adipisicing elit. Enim, quidem accusantium. Facilis maxime explicabo repellat ea animi expedita autem, dignissimos voluptatibus doloribus, perferendis cum distinctio. Ab saepe non ipsam quidem.
            </p>
        </div>
        <div>
            <p className='text-x1 font-medium mn-5' ></p>
            <ul className='flex flex-col gap-1 text-gray-600'>
                <li>Home</li>
                <li>About us</li>
                <li>Delivery</li>
                <li>Privacy policy</li>

            </ul>
        </div>

        <div>
            <p className='text-x1 font-medium mb-5'>GET IN TOUCH </p>
            <ul className='flex flex-col gap-1 text-gray-600' >
                <li>+1-212-456-7890-</li>
                <li>contact@foreveryou.com</li>
            </ul>
        </div>

      </div>
        <div>
            <hr />
            <p className='py-5 text-sm text-center'>Copyright 2025@ forever.com - All rights Reserved.</p>
        </div>


    </div>
  )
}

export default Footer
