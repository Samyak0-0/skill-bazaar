// pages/api/orders.ts
import { NextResponse } from "next/server";
import { prisma } from "@/utilities/prisma";

const prisma = new PrismaClient();

export default async function handler(req) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    try {
      const { type } = req.query;
      const email = session.user?.email;

      if (!email) {
        return res.status(400).json({ error: 'Email is required' });
      }

      const orders = await prisma.order.findMany({
        where: {
          userEmail: email,
          type: type === 'sold' ? 'SOLD' : 'BOUGHT'
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      return res.status(200).json({ 
        orders: orders.map(order => ({
          id: order.id,
          name: order.name,
          type: order.type.toLowerCase(),
          price: order.price,
          status: order.status,
          client: order.client,
          date: order.createdAt.toISOString()
        }))
      });
    } catch (error) {
      console.error('Error fetching orders:', error);
      return res.status(500).json({ error: 'Failed to fetch orders' });
    }
  }

  if (req.method === 'POST') {
    try {
      const { name, type, price, status, client } = req.body;
      const email = session.user?.email;

      if (!email) {
        return res.status(400).json({ error: 'Email is required' });
      }

      const newOrder = await prisma.order.create({
        data: {
          name,
          type: type === 'sold' ? 'SOLD' : 'BOUGHT',
          price,
          status: status || 'PENDING',
          userEmail: email,
          client
        }
      });

      return res.status(201).json({ order: newOrder });
    } catch (error) {
      console.error('Error creating order:', error);
      return res.status(500).json({ error: 'Failed to create order' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}