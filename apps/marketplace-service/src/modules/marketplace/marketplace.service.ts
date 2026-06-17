import { Injectable, NotFoundException } from '@nestjs/common';
import { MarketplaceRepository } from './marketplace.repository';
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

@Injectable()
export class MarketplaceService {
    constructor(private readonly marketplaceRepository: MarketplaceRepository) { }

    async listTalents(dto: ListTalentsDto) {
        return this.marketplaceRepository.listApprovedTalents(dto);
    }

    async getTalent(dto: GetMarketplaceTalentDto) {
        const talent = await this.marketplaceRepository.findTalentById(dto.talent_id);
        if (!talent) {
            throw new NotFoundException(`Talent not found: ${dto.talent_id}`);
        }

        // Record profile view async — don't wait for it
        if (dto.viewer_user_id) {
            this.marketplaceRepository
                .recordProfileView(dto.talent_id, dto.viewer_user_id)
                .catch(() => { });
        }

        return talent;
    }

    async getCart(dto: GetCartDto) {
        return this.marketplaceRepository.getOrCreateCart(dto.user_id);
    }

    async addToCart(dto: AddToCartDto) {
        return this.marketplaceRepository.addToCart(
            dto.user_id,
            dto.talent_id,
        );
    }

    async removeFromCart(dto: RemoveFromCartDto) {
        return this.marketplaceRepository.removeFromCart(dto.cart_item_id, dto.user_id);
    }

    async getWishlist(dto: GetWishlistDto) {
        return this.marketplaceRepository.getWishlist(dto.user_id);
    }

    async addToWishlist(dto: AddToWishlistDto) {
        return this.marketplaceRepository.addToWishlist(dto.user_id, dto.talent_id);
    }

    async removeFromWishlist(dto: RemoveFromWishlistDto) {
        return this.marketplaceRepository.removeFromWishlist(dto.user_id, dto.talent_id);
    }
}