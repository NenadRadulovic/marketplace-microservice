import { DynamicModule, Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';
import { join } from 'path';
import * as DbEntity from './entities';

const ENTITIES_PATH = join(process.cwd(), '**/*.entity.ts');

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
            entities: [
              DbEntity.Address,
              DbEntity.Marketplace,
              DbEntity.Orders,
              DbEntity.PaymentInformation,
              DbEntity.Product,
              DbEntity.Review,
              DbEntity.User,
              DbEntity.Feature,
            ],
            synchronize: true,
            autoLoadEntities: true,
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
