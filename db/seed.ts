import { prisma } from "@/db/prisma";
import sampleData from "./sample-data";

async function main() {
  await prisma.product.deleteMany();
  await prisma.brand.deleteMany();
  await prisma.user.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.verificationToken.deleteMany();

  const brandData = sampleData.products.map((p) => p.brand);

  // 1️⃣ 创建品牌
  await prisma.brand.createMany({
    data: brandData.map((b) => ({ name: b })),
    skipDuplicates: true,
  });

  // 2️⃣ 获取品牌 ID
  const brands = await prisma.brand.findMany();
  const brandMap = Object.fromEntries(brands.map((b) => [b.name, b.id]));

  // 3️⃣ 创建产品
  await prisma.product.createMany({
    data: sampleData.products.map((p) => ({
      name: p.name,
      slug: p.slug,
      description: p.description,
      images: p.images,
      price: p.price,
      rating: p.rating,
      numReviews: p.numReviews,
      stock: p.stock,
      isFeatured: p.isFeatured,
      banner: p.banner,
      brandId: brandMap[p.brand],
      category: p.category,
    })),
  });

  // 4️⃣ 创建用户
  await prisma.user.createMany({
    data: sampleData.users,
  });

  console.log("Database seeded successfully!");
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
