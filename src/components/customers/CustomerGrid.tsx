import React from 'react';
import CustomerCard from './CustomerCard';
import { CustomerStory, CustomerCategory } from '../../types/customer';

interface CustomerGridProps {
  customers: CustomerStory[];
  activeFilter: 'All Stories' | CustomerCategory;
}

const CustomerGrid: React.FC<CustomerGridProps> = ({ customers, activeFilter }) => {
  // Filter customers based on active filter
  const filteredCustomers = activeFilter === 'All Stories' 
    ? customers 
    : customers.filter(customer => customer.category === activeFilter);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {filteredCustomers.map((customer, index) => (
        <CustomerCard
          key={index}
          title={customer.title}
          description={customer.description}
          route={customer.route}
          img={customer.img}
          alt={customer.alt}
          companyName={customer.companyName}
          category={customer.category}
        />
      ))}
    </div>
  );
};

export default CustomerGrid;







