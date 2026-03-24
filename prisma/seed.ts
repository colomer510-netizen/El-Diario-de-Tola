import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@portal-noticias.com";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "Admin123!";
  const adminName = process.env.ADMIN_NAME ?? "Administrador";

  // 1. Create admin user
  let admin = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!admin) {
    const password_hash = await bcrypt.hash(adminPassword, 12);
    admin = await prisma.user.create({
      data: {
        name: adminName,
        email: adminEmail,
        password_hash,
        role: "ADMIN",
      },
    });
    console.log(`✓ Admin creado: ${adminEmail}`);
  } else {
    console.log(`✓ Admin ya existe: ${adminEmail}`);
  }

  // 2. Cleanup existing articles to seed fresh ones
  await prisma.article.deleteMany({});
  console.log(`✓ Artículos anteriores eliminados (limpiando DB)`);

  // 3. Seed Articles
  const articlesData = [
    {
      title: "Nueva planta de energía solar inaugurada en Tola abastecerá al 40% del municipio",
      excerpt: "Con una inversión millonaria y utilizando tecnología de vanguardia, el nuevo parque solar promete reducir los cortes de energía y fomentar el turismo ecológico en la zona costera de Rivas.",
      content: "TOLA, RIVAS — En un evento histórico para la región, esta mañana se inauguró oficialmente la nueva planta de energía solar 'Sol del Pacífico' ubicada en las afueras de Tola. El complejo cuenta con más de 15,000 paneles solares de última generación y tiene una capacidad instalada suficiente para abastecer a más del 40% de los hogares y negocios locales.\n\nEl proyecto fue desarrollado en colaboración con inversionistas extranjeros y el gobierno municipal, con el objetivo no solo de estabilizar la red eléctrica local —que ha sufrido apagones durante la temporada alta de turismo— sino también de reducir la huella de carbono del destino. Se espera que la planta reduzca las emisiones de CO2 en más de 20,000 toneladas anuales.\n\n'Este es un gran paso hacia el futuro sostenible que queremos para Tola y todo el departamento de Rivas', mencionó uno de los portavoces durante la ceremonia. Adicionalmente, el parque solar ha generado más de 200 empleos directos durante su fase de construcción y mantendrá a unos 30 técnicos especializados para su operación diaria.",
      category: "ECONOMÍA",
      imageUrl: "https://images.unsplash.com/photo-1509391366360-1200bcce7ceb?q=80&w=1200&auto=format&fit=crop",
      authorId: admin.id,
    },
    {
      title: "Las playas de Guasacate y Popoyo se preparan para el Campeonato Nacional de Surf",
      excerpt: "Los mejores surfistas del país y delegaciones internacionales llegan a las costas de Tola para competir en las olas más famosas de Nicaragua este fin de semana.",
      content: "La adrenalina y las olas gigantes están de vuelta. Este fin de semana, Tola se convierte en el epicentro del deporte acuático al hospedar el Campeonato Nacional de Surf 2026 en las reconocidas playas de Popoyo y Guasacate. Se espera la llegada de más de 150 competidores, incluyendo campeones latinoamericanos.\n\nEl turismo en la zona ha reportado un 100% de ocupación hotelera. Los negocios locales, desde restaurantes hasta escuelas de surf, se han abastecido para recibir a miles de espectadores. 'Este evento pone a Tola en el mapa mundial y ayuda muchísimo a nuestra economía local', afirmó la asociación de comerciantes de la playa.\n\nLas autoridades locales han desplegado un operativo especial de seguridad y limpieza para garantizar que las playas se mantengan prístinas durante y después del torneo. Se habilitarán zonas de reciclaje y stands de información turística.",
      category: "DEPORTES",
      imageUrl: "https://images.unsplash.com/photo-1502680390469-be75c86b636f?q=80&w=1200&auto=format&fit=crop",
      authorId: admin.id,
    },
    {
      title: "Reforestación masiva en las reservas naturales de Rivas con especies nativas",
      excerpt: "Cientos de voluntarios, estudiantes y brigadistas se unieron este domingo para plantar más de 5,000 árboles de caoba, cedro y madero negro en zonas afectadas por incendios.",
      content: "En un esfuerzo comunitario sin precedentes, más de 400 ciudadanos de Tola y comunidades aledañas se organizaron este fin de semana para llevar a cabo una jornada de reforestación masiva. El esfuerzo busca restaurar las áreas de bosque seco tropical que fueron severamente dañadas por los incendios forestales de la pasada temporada seca.\n\nSe seleccionaron cuidadosamente especies nativas como la caoba, el cedro, el pochote y el madero negro, conocidas por su resistencia y su capacidad de retener agua en el suelo. Los estudiantes de secundaria locales fueron los principales protagonistas, adoptando zonas específicas que se encargarán de monitorear durante los próximos meses.\n\nLa municipalidad proveyó transporte y herramientas, mientras que negocios locales donaron agua y alimentos para los brigadistas. 'Ver a la juventud tan comprometida con nuestra tierra nos llena de esperanza; Tola es verde y vamos a asegurarnos de que siga siéndolo', declaró uno de los coordinadores.",
      category: "COMUNIDAD",
      imageUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=1200&auto=format&fit=crop",
      authorId: admin.id,
    },
    {
      title: "El turismo sostenible impulsa la recuperación económica de pequeños negocios",
      excerpt: "Hostales familiares, comedores y guías locales reportan el mejor cuatrimestre de los últimos cinco años gracias a nuevas políticas de turismo responsable.",
      content: "La economía de Tola está viendo un renacimiento impulsado por un enfoque diferente: el turismo sostenible y comunitario. A diferencia de las grandes cadenas, los pequeños hostales, comedores locales y guías turísticos independientes están experimentando un auge sin precedentes. Los turistas internacionales buscan cada vez más experiencias auténticas y un contacto real con la cultura nicaragüense.\n\nEl Ministerio de Turismo, en conjunto con organizaciones locales, ha capacitado a más de 50 pequeños empresarios en atención al cliente, marketing digital y prácticas amigables con el medio ambiente. Muchos hostales ahora utilizan energía solar y sistemas de recolección de agua pluvial, lo cual es altamente valorado por los visitantes.\n\n'Antes dependíamos solo de la temporada alta, ahora vemos un flujo constante de personas que prefieren quedarse en nuestras casas de huéspedes y comer en nuestras fondas', explicó doña Carmen, dueña de un pequeño hospedaje en el centro del municipio.",
      category: "ECONOMÍA",
      imageUrl: "https://images.unsplash.com/photo-1499591934245-40b55745b905?q=80&w=1200&auto=format&fit=crop",
      authorId: admin.id,
    },
    {
      title: "Clínica móvil de salud brindará atención gratuita en comunidades rurales de Tola",
      excerpt: "El MINSA anunció que durante toda la semana la clínica móvil visitará comunidades alejadas ofreciendo consultas generales, pediatría y odontología.",
      content: "Para llevar la atención médica a quienes más lo necesitan y menos posibilidades tienen de trasladarse al centro urbano, el Ministerio de Salud (MINSA) ha lanzado un programa de clínicas móviles que recorrerá las comunidades más alejadas del municipio de Tola durante los próximos 7 días.\n\nLas unidades móviles están equipadas para realizar ultrasonidos, exámenes odontológicos, papanicolaou, y consultas de pediatría y medicina general. Además, se habilitará una farmacia móvil que entregará medicamentos básicos de forma totalmente gratuita a los pacientes atendidos.\n\nLíderes comunitarios han estado informando casa por casa sobre los horarios y puntos de encuentro. 'Esta es una gran oportunidad para que nuestros mayores y niños reciban chequeos médicos sin incurrir en gastos de transporte que a veces son prohibitivos para las familias campesinas', señaló un líder de la comunidad de Las Salinas.",
      category: "SALUD",
      imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=1200&auto=format&fit=crop",
      authorId: admin.id,
    }
  ];

  for (const data of articlesData) {
    await prisma.article.create({ data });
  }

  console.log(`✓ Seed completado: Se insertaron 5 artículos reales con imágenes`);
}

main()
  .catch((e) => {
    console.error("✗ Error en seed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
