import 'dotenv/config' // <--- ESSA LINHA É A SOLUÇÃO
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    const users = [
        {
            username: 'mrsaoc',
            password: '1234',
            name: 'amor da pudizimho',
            avatarUrl: 'https://github.com/shadcn.png',
        },
        {
            username: 'amococteautwins',
            password: '1234',
            name: 'amor da pudizimhor',
            avatarUrl: 'https://github.com/shadcn.png',
        },
    ]

    console.log('🌱 Iniciando a semeadura do banco de dados...')

    for (const user of users) {
        const hashedPassword = await bcrypt.hash(user.password, 10)

        const upsertedUser = await prisma.user.upsert({
            where: { username: user.username },
            update: {
                password: hashedPassword,
            },
            create: {
                username: user.username,
                password: hashedPassword,
                name: user.name,
                avatarUrl: user.avatarUrl,
                bio: 'Cinéfilo oficial do Atitino.',
            },
        })
        console.log(`👤 Usuário garantido: ${upsertedUser.username}`)
    }

    console.log('✅ Semeadura concluída.')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })