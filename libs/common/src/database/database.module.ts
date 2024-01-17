import { DynamicModule, Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as DbEntities from './entities';
import { DataSource, DataSourceOptions } from 'typeorm';

@Global()
@Module({})
export class PgDatabaseModule {
  static register(): DynamicModule {
    return {
      module: PgDatabaseModule,
      imports: [
        TypeOrmModule.forRootAsync({
          useFactory: (configService: ConfigService) => ({
            type: 'postgres',
            host: configService.get<string>('POSTGRES_HOST'),
            port: configService.get<number>('POSTGRES_PORT'),
            username: configService.get<string>('POSTGRES_USER'),
            password: configService.get<string>('POSTGRES_PASSWORD'),
            entities: [DbEntities.Product, DbEntities.User, DbEntities.Orders],
            synchronize: true,
          }),
          inject: [ConfigService],
          dataSourceFactory: async (options: DataSourceOptions) => {
            return new DataSource(options).initialize();
          },
        }),
      ],
    };
  }
}
