import { Injectable } from '@nestjs/common';
import { PrismaService } from '@app/prisma';
import { ListTalentsDto } from '@app/contracts';

@Injectable()
export class MarketplaceRepository {
  constructor(private readonly prisma: PrismaService) { }

  async listApprovedTalents(dto: ListTalentsDto) {
    const page = dto.page ?? 1;
    const limit = dto.limit ?? 20;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {
      status: 'APPROVED',
      is_listed: true,
    };

    if (dto.search) {
      where['OR'] = [
        { full_name: { contains: dto.search, mode: 'insensitive' } },
        { title: { contains: dto.search, mode: 'insensitive' } },
        { bio: { contains: dto.search, mode: 'insensitive' } },
        { skills: { some: { skill_name: { contains: dto.search, mode: 'insensitive' } } } },
      ];
    }

    if (dto.work_model) where['work_model'] = dto.work_model;
    if (dto.country_code) where['country_code'] = dto.country_code;
    if (dto.min_experience !== undefined) {
      where['years_experience'] = { ...where['years_experience'] as object, gte: dto.min_experience };
    }
    if (dto.max_experience !== undefined) {
      where['years_experience'] = { ...where['years_experience'] as object, lte: dto.max_experience };
    }

    const [data, total] = await this.prisma.$transaction([
      this.prisma.talentProfile.findMany({
        where,
        skip,
        take: limit,
        orderBy: { approved_at: 'desc' },
        select: {
          id: true,
          full_name: true,
          title: true,
          bio: true,
          avatar_url: true,
          country_code: true,
          location_city: true,
          years_experience: true,
          availability: true,
          work_model: true,
          bill_rate_hourly: true,
          bill_rate_weekly: true,
          vetted_tier: true,
          ai_match_score: true,
          profile_score: true,
          customer_rating: true,
          rating_count: true,
          skills: { select: { skill_name: true, skill_type: true, category: true } },
          badges: { select: { badge_type: true, badge_label: true } },
        },
      }),
      this.prisma.talentProfile.count({ where }),
    ]);

    return {
      data,
      meta: { total, page, limit, total_pages: Math.ceil(total / limit) },
    };
  }

  async findTalentById(talentId: string) {
    return this.prisma.talentProfile.findUnique({
      where: { id: talentId, status: 'APPROVED' },
      include: {
        skills: true,
        badges: true,
        projects: true,
        previous_companies: true,
        skill_proficiencies: true,
        experience_snapshots: true,
      },
    });
  }

  async getOrCreateCart(userId: string) {
    let cart = await this.prisma.cart.findFirst({
      where: { user_id: userId, status: 'ACTIVE' },
      include: {
        items: {
          include: {
            talent: {
              select: {
                id: true,
                full_name: true,
                title: true,
                avatar_url: true,
                bill_rate_hourly: true,
                bill_rate_weekly: true,
                country_code: true,
              },
            },
          },
        },
      },
    });

    if (!cart) {
      cart = await this.prisma.cart.create({
        data: { user_id: userId, status: 'ACTIVE' },
        include: { items: { include: { talent: true } } },
      });
    }

    return cart;
  }

  async addToCart(userId: string, talentId: string, durationDays?: number) {
    const cart = await this.getOrCreateCart(userId);

    const existing = await this.prisma.cartItem.findFirst({
      where: { cart_id: cart.id, talent_id: talentId },
    });

    if (existing) {
      return this.getOrCreateCart(userId);
    }

    await this.prisma.cartItem.create({
      data: {
        cart_id: cart.id,
        talent_id: talentId,
        hours_per_week: 40,        // default full time
        duration_weeks: 4,         // default 1 month
        bill_rate_snapshot: 0,     // will be updated at checkout
        total_cost: 0,             // will be calculated at checkout
      },
    });

    return this.getOrCreateCart(userId);
  }

  async removeFromCart(cartItemId: string, userId: string) {
    const item = await this.prisma.cartItem.findFirst({
      where: { id: cartItemId, cart: { user_id: userId } },
    });

    if (item) {
      await this.prisma.cartItem.delete({ where: { id: cartItemId } });
    }

    return this.getOrCreateCart(userId);
  }

  async getWishlist(userId: string) {
    return this.prisma.wishlist.findMany({
      where: { user_id: userId },
      include: {
        talent: {
          select: {
            id: true,
            full_name: true,
            title: true,
            avatar_url: true,
            country_code: true,
            bill_rate_hourly: true,
            skills: { select: { skill_name: true, skill_type: true } },
          },
        },
      },
      orderBy: { created_at: 'desc' },
    });
  }

  async addToWishlist(userId: string, talentId: string) {
    const existing = await this.prisma.wishlist.findFirst({
      where: { user_id: userId, talent_id: talentId },
    });

    if (!existing) {
      await this.prisma.wishlist.create({
        data: { user_id: userId, talent_id: talentId },
      });
    }

    return this.getWishlist(userId);
  }

  async removeFromWishlist(userId: string, talentId: string) {
    await this.prisma.wishlist.deleteMany({
      where: { user_id: userId, talent_id: talentId },
    });
    return this.getWishlist(userId);
  }

  async recordProfileView(talentId: string, viewerUserId: string) {
    await this.prisma.profileView.create({
      data: { talent_id: talentId, viewer_user_id: viewerUserId },
    }).catch(() => {
      // Ignore duplicate view errors
    });
  }
}