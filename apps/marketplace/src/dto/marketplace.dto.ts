import { IsOptional, IsString } from 'class-validator';

export class CreateMarketplaceRequest {
  @IsString()
  name: string;

  @IsString()
  logo: string;

  @IsString()
  description: string;
}

export class UpdateMarketplaceRequest {
  @IsString()
  @IsOptional()
  logo: string;

  @IsString()
  @IsOptional()
  description: string;
}
