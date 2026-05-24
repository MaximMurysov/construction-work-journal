import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { validateWorkEntry } from "@/lib/validation";

function parseDate(value: string | null): Date | undefined {
  if (!value) {
    return undefined;
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const from = parseDate(searchParams.get("from"));
  const to = parseDate(searchParams.get("to"));
  const sort = searchParams.get("sort") === "desc" ? "desc" : "asc";

  const entries = await prisma.workEntry.findMany({
    where: {
      ...(from || to
        ? {
            performedAt: {
              ...(from ? { gte: from } : {}),
              ...(to ? { lte: to } : {}),
            },
          }
        : {}),
    },
    include: {
      workType: true,
    },
    orderBy: {
      performedAt: sort,
    },
  });

  return NextResponse.json(
    entries.map((entry) => ({
      id: entry.id,
      performedAt: entry.performedAt.toISOString().slice(0, 10),
      workTypeId: entry.workTypeId,
      workTypeName: entry.workType.name,
      volume: Number(entry.volume),
      unit: entry.unit,
      executorName: entry.executorName,
    })),
  );
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const validation = validateWorkEntry(body);

  if (!validation.ok) {
    return NextResponse.json({ errors: validation.errors }, { status: 400 });
  }

  const workType = await prisma.workType.findUnique({
    where: { id: validation.data.workTypeId },
  });

  if (!workType) {
    return NextResponse.json(
      { errors: { workTypeId: "Вид работ не найден" } },
      { status: 400 },
    );
  }

  const entry = await prisma.workEntry.create({
    data: {
      performedAt: new Date(validation.data.performedAt),
      workTypeId: validation.data.workTypeId,
      volume: validation.data.volume,
      unit: validation.data.unit,
      executorName: validation.data.executorName,
    },
    include: {
      workType: true,
    },
  });

  return NextResponse.json(
    {
      id: entry.id,
      performedAt: entry.performedAt.toISOString().slice(0, 10),
      workTypeId: entry.workTypeId,
      workTypeName: entry.workType.name,
      volume: Number(entry.volume),
      unit: entry.unit,
      executorName: entry.executorName,
    },
    { status: 201 },
  );
}
