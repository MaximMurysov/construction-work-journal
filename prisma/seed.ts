import "dotenv/config";

import { prisma } from "../src/lib/prisma";

const workTypes = [
  { name: "Кладка перегородок", defaultUnit: "м²" },
  { name: "Монтаж опалубки", defaultUnit: "м²" },
  { name: "Бетонирование фундамента", defaultUnit: "м³" },
  { name: "Арматурные работы", defaultUnit: "т" },
  { name: "Кровельные работы", defaultUnit: "м²" },
  { name: "Штукатурка стен", defaultUnit: "м²" },
];

async function main() {
  for (const workType of workTypes) {
    await prisma.workType.upsert({
      where: { name: workType.name },
      update: { defaultUnit: workType.defaultUnit },
      create: workType,
    });
  }

  const types = await prisma.workType.findMany();
  const existingEntries = await prisma.workEntry.count();

  if (existingEntries === 0 && types.length > 0) {
    await prisma.workEntry.createMany({
      data: [
        {
          performedAt: new Date("2026-05-20"),
          workTypeId: types[0].id,
          volume: 24,
          unit: types[0].defaultUnit,
          executorName: "Иванов П.С.",
        },
        {
          performedAt: new Date("2026-05-21"),
          workTypeId: types[1].id,
          volume: 18.5,
          unit: types[1].defaultUnit,
          executorName: "Петров А.В.",
        },
        {
          performedAt: new Date("2026-05-22"),
          workTypeId: types[2].id,
          volume: 12,
          unit: types[2].defaultUnit,
          executorName: "Сидоров К.М.",
        },
      ],
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
