import { IsString, IsNotEmpty, IsOptional, IsInt, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class ListTalentsDto {
  @ApiPropertyOptional({ example: 1 })
  @IsOptional() @Type(() => Number) @IsInt() @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ example: 20 })
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(50)
  limit?: number = 20;

  @ApiPropertyOptional({ example: 'Node.js' })
  @IsOptional() @IsString()
  search?: string;

  @ApiPropertyOptional({ example: 'REMOTE' })
  @IsOptional() @IsString()
  work_model?: string;

  @ApiPropertyOptional({ example: 'IN' })
  @IsOptional() @IsString()
  country_code?: string;

  @ApiPropertyOptional({ example: 3 })
  @IsOptional() @Type(() => Number) @IsInt()
  min_experience?: number;

  @ApiPropertyOptional({ example: 10 })
  @IsOptional() @Type(() => Number) @IsInt()
  max_experience?: number;
}

export class GetMarketplaceTalentDto {
  @IsString() @IsNotEmpty()
  talent_id!: string;

  @IsOptional() @IsString()
  viewer_user_id?: string;
}

export class AddToCartDto {
  @ApiProperty({ example: 'uuid-of-talent-profile' })
  @IsString() @IsNotEmpty()
  talent_id!: string;

  @IsString() @IsNotEmpty()
  user_id!: string;
}

export class RemoveFromCartDto {
  @IsString() @IsNotEmpty()
  cart_item_id!: string;

  @IsString() @IsNotEmpty()
  user_id!: string;
}

export class GetCartDto {
  @IsString() @IsNotEmpty()
  user_id!: string;
}

export class AddToWishlistDto {
  @ApiProperty({ example: 'uuid-of-talent-profile' })
  @IsString() @IsNotEmpty()
  talent_id!: string;

  @IsString() @IsNotEmpty()
  user_id!: string;
}

export class RemoveFromWishlistDto {
  @IsString() @IsNotEmpty()
  talent_id!: string;

  @IsString() @IsNotEmpty()
  user_id!: string;
}

export class GetWishlistDto {
  @IsString() @IsNotEmpty()
  user_id!: string;
}