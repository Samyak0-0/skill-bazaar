import React, { useState } from 'react'

type Props = {}

interface OrderData {
  workTitle: string;
  description: string;
  rate: string;
  category: string;
  serviceId: string;  // Required by schema
  buyerId: string;    // Required by schema
  sellerId: string;   // Required by schema
  status: string;     // Required by schema
}

const Create_order = (props: Props) => {
  const [formData, setFormData] = useState<OrderData>({
    workTitle: '',
    description: '',
    rate: '',
    category: 'Education',
    // These will need to be set based on your authentication and service selection
    serviceId: '', 
    buyerId: '',  
    sellerId: '',
    status: 'PENDING' // Default status
  });

  const categories = ['Education', 'Programming', 'Writing', 'Design', 'Marketing'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setFormData({
          workTitle: '',
          description: '',
          rate: '',
          category: 'Education',
          serviceId: '',
          buyerId: '',
          sellerId: '',
          status: 'PENDING'
        });
        alert('Order created successfully!');
      } else {
        throw new Error('Failed to create order');
      }
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Failed to create order. Please try again.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Create a request</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="workTitle" className="block text-sm font-medium mb-2">
            Work title:
          </label>
          <input
            type="text"
            id="workTitle"
            value={formData.workTitle}
            onChange={(e) => setFormData({ ...formData, workTitle: e.target.value })}
            className="w-full p-2 border rounded-md text-black"
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-2">
            Description:
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full p-2 border rounded-md h-32 text-black"
            required
          />
        </div>

        <div>
          <label htmlFor="rate" className="block text-sm font-medium mb-2">
            Rate:
          </label>
          <input
            type="text"
            id="rate"
            value={formData.rate}
            onChange={(e) => setFormData({ ...formData, rate: e.target.value })}
            placeholder="50$/HR"
            className="w-full p-2 border rounded-md text-black"
            required
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium mb-2">
            Category:
          </label>
          <select
            id="category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full p-2 border rounded-md text-black"
            required
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
        >
          POST THE REQUEST
        </button>
      </form>
    </div>
  );
};

export default Create_order;