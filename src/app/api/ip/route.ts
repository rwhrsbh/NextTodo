// src/app/api/ip/route.ts
import { NextResponse } from 'next/server';

interface IpResponse {
  ip: string;
}

export async function GET(request: Request): Promise<NextResponse<IpResponse>> {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded ? 
    forwarded.split(',')[0] : 
    request.headers.get("x-real-ip") || 'unknown';
  
  return NextResponse.json({ ip });
}
