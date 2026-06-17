import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MARKETPLACE_PATTERNS } from '@app/contracts';
import { MarketplaceService } from './marketplace.service';
import {
  ListTalentsDto,
  GetMarketplaceTalentDto,
  AddToCartDto,
  RemoveFromCartDto,
  GetCartDto,
  AddToWishlistDto,
  RemoveFromWishlistDto,
  GetWishlistDto,
} from '@app/contracts';

@Controller()
export class MarketplaceController {
  constructor(private readonly marketplaceService: MarketplaceService) {}

  @MessagePattern(MARKETPLACE_PATTERNS.LIST_TALENTS)
  listTalents(@Payload() dto: ListTalentsDto) {
    return this.marketplaceService.listTalents(dto);
  }

  @MessagePattern(MARKETPLACE_PATTERNS.GET_TALENT)
  getTalent(@Payload() dto: GetMarketplaceTalentDto) {
    return this.marketplaceService.getTalent(dto);
  }

  @MessagePattern(MARKETPLACE_PATTERNS.GET_CART)
  getCart(@Payload() dto: GetCartDto) {
    return this.marketplaceService.getCart(dto);
  }

  @MessagePattern(MARKETPLACE_PATTERNS.ADD_TO_CART)
  addToCart(@Payload() dto: AddToCartDto) {
    return this.marketplaceService.addToCart(dto);
  }

  @MessagePattern(MARKETPLACE_PATTERNS.REMOVE_FROM_CART)
  removeFromCart(@Payload() dto: RemoveFromCartDto) {
    return this.marketplaceService.removeFromCart(dto);
  }

  @MessagePattern(MARKETPLACE_PATTERNS.GET_WISHLIST)
  getWishlist(@Payload() dto: GetWishlistDto) {
    return this.marketplaceService.getWishlist(dto);
  }

  @MessagePattern(MARKETPLACE_PATTERNS.ADD_TO_WISHLIST)
  addToWishlist(@Payload() dto: AddToWishlistDto) {
    return this.marketplaceService.addToWishlist(dto);
  }

  @MessagePattern(MARKETPLACE_PATTERNS.REMOVE_FROM_WISHLIST)
  removeFromWishlist(@Payload() dto: RemoveFromWishlistDto) {
    return this.marketplaceService.removeFromWishlist(dto);
  }
}