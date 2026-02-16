import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ThrottlerModule } from '@nestjs/throttler';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { getDatabaseConfig } from './config/database.config';
import { AuthModule } from './auth/auth.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { ClientesModule } from './clientes/clientes.module';
import { ProdutosModule } from './produtos/produtos.module';
import { PedidosModule } from './pedidos/pedidos.module';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Database
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        getDatabaseConfig(configService),
    }),

    // Static files (uploaded images)
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),

    // Rate limiting
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 10,
    }]),

    // Feature modules
    AuthModule,
    UsuariosModule,
    ClientesModule,
    ProdutosModule,
    PedidosModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
