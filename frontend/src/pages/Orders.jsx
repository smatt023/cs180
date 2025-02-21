import React from 'react'

const Orders = () => {
  
  const{ products,currency} = useContext(ShopContext);
  return (
    <div classname = 'border-t pt-16'>
      
      <div classname = 'text-2xl'>
        <title text1 = {'MY'} text2 = {'ORDERS'}/>
      </div>

      <div>
        {
          products.slice(1,4).map( (item, index)=> (
            <div key = {index} classname = ' py-4 border-b text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
              <div classname = 'flex items-start gap-6 text-sm'>
                <img classname = 'w-16 sm:w-20' src={item.image[0]} alt="" />
                <div>
                  <p classname = 'sm:text-base font-medium'> {image.name}</p>
                  <div classname = 'flex items-center gap-3 mt-2 text-base text-gray-700'>
                    <p classname = 'text-lg'>{currency}{item.price}</p>
                    <p> Quantity : 1</p>
                    <p> Size: M</p>
                  </div>
                  <p classname = 'margin-top'>Date <span className = ' text-gray-400'> 25, Jul, 2025</span></p>
                </div>
              </div>
              <div classname = ' md:w-1/2 flex justify-between'>
                <div classname = ' flex items-center gap-2'>
                  <p classname = 'min-w-2 h-2 rounded-full bg-green-500'></p>
                  <p classname = 'text-sm md:text-base'> Ready to ship</p>
                </div>
                <button classname = 'border px-4 py-2 text-sm font-medium rounded-sm'>Track Order</button>
              </div>
            </div>
          ))
        }
      </div>

    </div>
  )
}

export default Orders
