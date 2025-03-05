// Using CommonJS require instead of import
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedStocks() {
  const stocks = [
    {
      symbol: "AAPL",
      name: "Apple Inc.",
      currentPrice: 175.50,
      sector: "Technology",
      volume: 10000000,
      marketCap: 2800000000000,
      createdById: "cm7u8yp5a0000vbro8dauw2jf"
    },
    {
      symbol: "MSFT",
      name: "Microsoft Corporation",
      currentPrice: 325.20,
      sector: "Technology",
      volume: 8000000,
      marketCap: 2400000000000,
      createdById: "cm7u8yp5a0000vbro8dauw2jf"
    },
    {
      symbol: "GOOGL",
      name: "Alphabet Inc.",
      currentPrice: 162.80,
      sector: "Technology",
      volume: 5000000,
      marketCap: 2100000000000,
      createdById: "cm7u8yp5a0000vbro8dauw2jf"
    },
  ];

  for (const stock of stocks) {
    try {
      await prisma.stock.create({
        data: stock
      });
      console.log(`Created stock: ${stock.symbol}`);
    } catch (error) {
      console.error(`Error creating stock ${stock.symbol}:`, error);
    }
  }

  console.log('Seed completed successfully');
}

seedStocks()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });