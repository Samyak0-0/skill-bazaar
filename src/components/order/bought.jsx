import OrderCard from "./ordercard";

export default function Bought() {
  const boughtOrders = [
    { username: "Smith", skill: "Writing", work: "Article Writing", status: "Ongoing", date: "2024-06-10", reviews: 4 },
   { username: "Emma", skill: "SEO", work: "SEO Optimization", status: "Completed", date: "2024-05-15", reviews: 4 },
    { username: "Emma", skill: "SEO", work: "SEO Optimization", status: "Completed", date: "2024-05-15", reviews: 4 },
    { username: "Emma", skill: "SEO", work: "SEO Optimization", status: "Completed", date: "2024-05-15", reviews: 4 },
    { username: "Emma", skill: "SEO", work: "SEO Optimization", status: "Completed", date: "2024-05-15", reviews: 4 },
    { username: "Emma", skill: "SEO", work: "SEO Optimization", status: "Completed", date: "2024-05-15", reviews: 4 },
  { username: "Emma", skill: "SEO", work: "SEO Optimization", status: "Completed", date: "2024-05-15", reviews: 4 },
  ];
  return (
    <div>
      {boughtOrders.map((Order, index) => (
        <OrderCard key={index} {...Order} />
      ))}
    </div>
  );
}
