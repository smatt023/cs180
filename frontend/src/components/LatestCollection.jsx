import React, { useContext } from 'react'
import {ShopContext} from '../context/ShopContext'

const LatestCollection = () => {

    const { products } = useContext(ShopContext);
    //console.log(products);

    const[latestProducts, setLatestProducts] = useState([])

    useEffect(()=>{
        setLatestProducts(products.slice(0,10));
    },[]
    
    )

    return (
    <div className='my-10'>
        <div className='text-center py-8 tezt-3xl'>
            <Title text1 = {'LATEST'} text2= {'COLLECTIONS'} />
            <p className='w-3/4 m- auto text-xs sm:text-sm md:text-base text-gray-600'>
            Texttttt</p>

        </div>
      
    </div>
  )
}

export default Navbar
