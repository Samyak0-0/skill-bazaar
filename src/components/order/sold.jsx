import OrderCard from "./ordercard";

export default function Sold() {
  const soldOrders = [
    { username: "John", skill: "Web Dev", work: "E-commerce Site", status: "Ongoing", date: "2024-06-01", reviews: 3 },
    { username: "Jane", skill: "Design", work: "Logo Creation", status: "Completed", date: "2024-05-20", reviews: 5 },
  ];

  return (
    <div>
      {soldOrders.map((Order, index) => (
        <OrderCard key={index} {...Order} />
      ))}
    </div>
  );
}
