import React from 'react';

const TestSignup = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('🚀 Basic form submitted');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" placeholder="Username" name="username" />
      <button type="submit">Test Submit</button>
    </form>
  );
};

export default TestSignup;