import React from 'react'
import CustomerCard from './CustomerCard'
import { CustomerStory, CustomerCategory } from '../../types/customer'

interface CustomerGridProps {
  customers: CustomerStory[]
  activeFilter: 'All Stories' | CustomerCategory
}

const CustomerGrid: React.FC<CustomerGridProps> = ({ customers, activeFilter }) => {
  const filteredCustomers =
    activeFilter === 'All Stories' ? customers : customers.filter((customer) => customer.category === activeFilter)

  return (
    <ul className='m-0 grid list-none grid-cols-1 gap-[20px] p-0 sm:grid-cols-2 lg:grid-cols-3 lg:gap-[24px]'>
      {filteredCustomers.map((customer, index) => (
        <li key={customer.route} className='m-0 flex'>
          <CustomerCard
            title={customer.title}
            description={customer.description}
            route={customer.route}
            img={customer.img}
            imgWidth={customer.imgWidth}
            imgHeight={customer.imgHeight}
            alt={customer.alt}
            companyName={customer.companyName}
            category={customer.category}
            priority={index === 0}
          />
        </li>
      ))}
    </ul>
  )
}

export default CustomerGrid
