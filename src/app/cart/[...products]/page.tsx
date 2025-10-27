import React from 'react'
interface ProductPageProps {
  params?: { products: string[] }
}
const ProductPage = ({params} :ProductPageProps) => {
  return (
    <div>
      {/* Products Page
      in order to make the dynamic route work
      we should add [...products] in the folder name
      and also add the file name as page.tsx */}
      Products Page
      <ul> 
      { params?.products?.map(route => (
        <li>{route}</li>
      ))}
    </ul>
    </div>
  )
}

export default ProductPage
