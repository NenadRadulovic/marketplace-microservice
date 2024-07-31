import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { Marketplace } from '@app/common/database/entities';
import { MarketplaceRepository } from '../marketplace.repository';

@Injectable()
export class MarketplacePipe implements PipeTransform {
  constructor(private readonly marketplaceRepository: MarketplaceRepository) {}

  async transform(
    value: string,
    metadata: ArgumentMetadata,
  ): Promise<Marketplace | null> {
    return await this.marketplaceRepository.findEntityById({
      where: { id: value },
    });
  }
}
