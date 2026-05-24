import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { validateWorkEntry } from "@/lib/validation";

type RouteContext = {
  params: Promise<{ id: string }>;
};

function parseId(value: string): number | null {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export async function PUT(request: NextRequest, context: RouteContext) {
  const { id: rawId } = await context.params;
  const id = parseId(rawId);

  if (!id) {
    return NextResponse.json({ error: "Некорректный идентификатор" }, { status: 400 });
  }

  const existing = await prisma.workEntry.findUnique({ where: { id } });

  if (!existing) {
    return NextResponse.json({ error: "Запись не найдена" }, { status: 404 });
  }

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

  const entry = await prisma.workEntry.update({
    where: { id },
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

  return NextResponse.json({
    id: entry.id,
    performedAt: entry.performedAt.toISOString().slice(0, 10),
    workTypeId: entry.workTypeId,
    workTypeName: entry.workType.name,
    volume: Number(entry.volume),
    unit: entry.unit,
    executorName: entry.executorName,
  });
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  const { id: rawId } = await context.params;
  const id = parseId(rawId);

  if (!id) {
    return NextResponse.json({ error: "Некорректный идентификатор" }, { status: 400 });
  }

  const existing = await prisma.workEntry.findUnique({ where: { id } });

  if (!existing) {
    return NextResponse.json({ error: "Запись не найдена" }, { status: 404 });
  }

  await prisma.workEntry.delete({ where: { id } });

  return NextResponse.json({ ok: true });
}
