import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  CreateMarketplaceRequest,
  UpdateMarketplaceRequest,
} from './dto/marketplace.dto';
import { Response, response } from 'express';
import { MarketplaceService } from './marketplace.service';
import { TransformPipe } from '@app/common/pipes/transform.pipe';
import { Marketplace, User } from '@app/common/database/entities';
import { CurrentUser } from 'apps/auth-service/src/decorators/current-user.decorator';
import { JwtAuthGuard } from '@app/common';
import { MarketplacePipe } from './pipe/marketplace.pipe';

@Controller('marketplace')
export class MarketplaceController {
  constructor(private readonly marketplaceService: MarketplaceService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createMarketplace(
    @Body(new TransformPipe()) data: CreateMarketplaceRequest,
    @CurrentUser() user: User,
    @Res() res: Response,
  ) {
    try {
      const marketplace = new Marketplace({ ...data, user });
      const response = await this.marketplaceService.createMarketplace(
        marketplace,
      );
      return res.status(200).json(response);
    } catch (ex) {
      return res.status(400).json({ message: ex });
    }
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getMarketplaces(@Res() res: Response) {
    return res
      .status(200)
      .json(await this.marketplaceService.getMarketplaces());
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async updateMarketplace(
    @Body(new TransformPipe()) data: UpdateMarketplaceRequest,
    @Param('id', MarketplacePipe) marketplace: Marketplace,
    @CurrentUser() user: User,
    @Res() res: Response,
  ) {
    try {
      const updatedMarketplace = new Marketplace({ ...marketplace, ...data });
      const response = await this.marketplaceService.updateMarketplace(
        marketplace.id,
        updatedMarketplace,
      );
      return res.status(200).json(response);
    } catch (ex) {
      return res.status(400).json({ message: ex });
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getMarketplaceById(
    @Param('id', MarketplacePipe) marketplace: Marketplace,
    @Res() res: Response,
  ) {
    return res.status(200).json(marketplace);
  }
}
