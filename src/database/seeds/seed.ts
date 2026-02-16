import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Usuario, UserRole } from '../../usuarios/entities/usuario.entity';

export async function seed() {
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT || '5432'),
    username: process.env.DATABASE_USER || 'postgres',
    password: process.env.DATABASE_PASSWORD || 'postgres',
    database: process.env.DATABASE_NAME || 'crud_backend',
    entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
    synchronize: false,
  });

  await dataSource.initialize();

  const usuarioRepository = dataSource.getRepository(Usuario);

  // Check if admin already exists
  const existingAdmin = await usuarioRepository.findOne({
    where: { email: 'admin@admin.com' },
  });

  if (existingAdmin) {
    console.log('Admin user already exists');
    await dataSource.destroy();
    return;
  }

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);

  const admin = usuarioRepository.create({
    nome: 'Administrador',
    email: 'admin@admin.com',
    senha: hashedPassword,
    role: UserRole.ADMIN,
  });

  await usuarioRepository.save(admin);

  console.log('Admin user created successfully');
  console.log('Email: admin@admin.com');
  console.log('Password: admin123');

  await dataSource.destroy();
}

// Run seed if executed directly
if (require.main === module) {
  seed()
    .then(() => {
      console.log('Seeding completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Seeding failed:', error);
      process.exit(1);
    });
}
