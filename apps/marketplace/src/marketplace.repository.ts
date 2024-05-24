import { AbstractRepository } from '@app/common';
import { Marketplace } from '@app/common/database/entities';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class MarketplaceRepository extends AbstractRepository<Marketplace> {
  constructor(
    @InjectRepository(Marketplace)
    private readonly repo: Repository<Marketplace>,
  ) {
    super(repo);
  }
}
