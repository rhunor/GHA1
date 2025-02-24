// app/api/paystack/verify/[reference]/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { reference: string } }
) {
  const reference = params.reference;

  try {
    const response = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      }
    );

    const data = await response.json();

    return NextResponse.json({ status: data.status, data: data.data });
  } catch (error) {
    console.error('Error verifying transaction:', error);
    return NextResponse.json(
      { error: 'Failed to verify transaction' },
      { status: 500 }
    );
  }
}