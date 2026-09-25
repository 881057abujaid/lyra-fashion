import "dotenv/config";
import { prisma } from "../src/lib/prisma";

const email = process.argv[2];

if (!email) {
    throw new Error(
        "Please provide an email address.\nExample: npm run make-admin neha@example.com"
    );
}

async function main() {
    const user = await prisma.user.findUnique({
        where: {
            email: email.toLowerCase(),
        },
    });

    if (!user) {
        throw new Error(
            `No user found with email: ${email}`
        );
    }

    const updatedUser = await prisma.user.update({
        where: {
            id: user.id,
        },
        data: {
            role: "ADMIN",
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
        },
    });

    console.log("Admin role assigned successfully:");
    console.log(updatedUser);
}

main()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });