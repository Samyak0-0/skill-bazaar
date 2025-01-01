"use client";
import React from 'react';

interface Props {
  name: string;
  age: number;
}

const User_profile = ({ name, age }: Props) => {
  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', maxWidth: '400px', margin: 'auto' }}>
      <h2>User Profile</h2>
      <p><strong>Name:</strong> {name}</p>
      <p><strong>Age:</strong> {age}</p>

      <div style={{ marginTop: '20px' }}>
        <button 
          onClick={() => console.log('Skills button clicked')} 
          style={{ margin: '5px', padding: '10px', backgroundColor: 'gray', color: 'white', border: 'none', borderRadius: '5px' }}
        >
          Skills
        </button>

        <button 
          onClick={() => console.log('Interests button clicked')} 
          style={{ margin: '5px', padding: '10px', backgroundColor: 'gray', color: 'white', border: 'none', borderRadius: '5px' }}
        >
          Interests
        </button>

        <button 
          onClick={() => console.log('Finances button clicked')} 
          style={{ margin: '5px', padding: '10px', backgroundColor: 'gray', color: 'white', border: 'none', borderRadius: '5px' }}
        >
          Finances
        </button>

        <button 
          onClick={() => console.log('Orders button clicked')} 
          style={{ margin: '5px', padding: '10px', backgroundColor: 'gray', color: 'white', border: 'none', borderRadius: '5px' }}
        >
          Orders
        </button>

        <button 
          onClick={() => console.log('Logout button clicked')} 
          style={{ margin: '5px', padding: '10px', backgroundColor: 'gray', color: 'white', border: 'none', borderRadius: '5px' }}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default User_profile;
