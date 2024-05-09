import DBClient from '@/lib/db';
import httpStatus from 'http-status';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await DBClient.getInstance().$queryRaw`SELECT 1`;
    return NextResponse.json({
      message: '🔥 Slack Integration is rolling 🔥',
    });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        message: '💥 Houston, we have a problem 💥',
        error,
      },
      { status: httpStatus.INTERNAL_SERVER_ERROR },
    );
  }
}
