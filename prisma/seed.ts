import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {

    const user = await prisma.user.upsert({
        where: { id: 1 },
        update: {},
        create: {
          identicationCard: '1111',
          name: 'admin',
          lastName: 'admin',
          email: 'admin@gmail.com',
          password: '123',
          phone: '31234543534',
          rolId: 1,
          genderId: 5,

        },
      });



    const statusData = [
      { id: 1, status: 'desertor', description: 'Estudiante que se retiró en la universidad más de dos semestres' },
      { id: 2, status: 'ausente', description: 'Estudiante que se retiró en la universidad solo por un semestre' },
      { id: 3, status: 'matriculado', description: 'Estudiante que actualmente se encuentra en la universidad' },
    ];
  
    for (const data of statusData) {
      await prisma.status.upsert({
        where: { id: data.id },
        update: {},
        create: data,
      });
    }

    const genderData = [
        { id: 1, gender: 'hombre', description: 'Identidad de género masculina' },
        { id: 2, gender: 'mujer', description: 'Identidad de género femenina' },
        { id: 3, gender: 'no binario', description: 'Identidad de género no específicamente masculina ni femenina' },
        { id: 4, gender: 'genero fluido', description: 'Identidad de género que puede cambiar con el tiempo' },
        { id: 5, gender: 'otro', description: 'Identidad de género que no se ajusta a las categorías tradicionales' },
      ];

      for (const data of genderData) {
        await prisma.gender.upsert({
          where: { id: data.id },
          update: {},
          create: data,
        });
      }

     const rolData = [
        {id: 1, rol: 'administrador', description: 'Rol con acceso total a todas las funciones del sistema.'},
        {id: 2, rol:'estudiante',description:'Rol asignado a estudiantes.'}
     ] 

     for (const data of rolData) {
        await prisma.rol.upsert({
          where: { id: data.id },
          update: {},
          create: data,
        });
      }

  }
  

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
