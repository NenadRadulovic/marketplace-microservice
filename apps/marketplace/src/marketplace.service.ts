import { BadRequestException, Injectable } from '@nestjs/common';
import { MarketplaceRepository } from './marketplace.repository';
import { Marketplace } from '@app/common/database/entities';

@Injectable()
export class MarketplaceService {
  constructor(private readonly repository: MarketplaceRepository) {}

  async createMarketplace(data: Marketplace): Promise<Marketplace> {
    const newEntity = await this.repository.createEntity(data);
    return newEntity;
  }

  async getMarketplaces(): Promise<Marketplace[]> {
    return await this.repository.findAllEntity();
  }

  async getMarketplaceByID(id: string): Promise<Marketplace> {
    return await this.repository.findEntityById({
      where: { id },
    });
  }

  async updateMarketplace(
    id: string,
    marketplace: Marketplace,
  ): Promise<Marketplace> {
    const updatedEntity = await this.repository.updateEntity(id, marketplace);
    return updatedEntity;
  }
}
