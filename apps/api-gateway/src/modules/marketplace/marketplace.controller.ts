import {
  Controller,
  Get,
  Post,
  Delete,
  Query,
  Param,
  Body,
  HttpCode,
  HttpStatus,
  Inject,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, timeout } from 'rxjs';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { MARKETPLACE_PATTERNS } from '@app/contracts';
import { CurrentUser, UserPayload, Public } from '@app/common';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { SERVICE_TOKENS } from '../../config/clients.config';

@ApiTags('Marketplace')
@ApiBearerAuth('JWT')
@Controller('marketplace')
@UseGuards(JwtAuthGuard)
export class MarketplaceController {
  constructor(
    @Inject(SERVICE_TOKENS.MARKETPLACE)
    private readonly marketplaceClient: ClientProxy,
  ) {}

  // ── Public routes — no login required ────────────────────────────────

  @Get('talents')
  @Public()
  @ApiOperation({
    summary: 'Browse approved talents',
    description: 'Public — no login required. Paginated list with filters.',
  })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  @ApiQuery({ name: 'search', required: false, example: 'Node.js' })
  @ApiQuery({ name: 'work_model', required: false, example: 'REMOTE' })
  @ApiQuery({ name: 'country_code', required: false, example: 'IN' })
  @ApiQuery({ name: 'min_experience', required: false, example: 2 })
  @ApiQuery({ name: 'max_experience', required: false, example: 8 })
  listTalents(@Query() query: Record<string, unknown>) {
    return firstValueFrom(
      this.marketplaceClient
        .send(MARKETPLACE_PATTERNS.LIST_TALENTS, query)
        .pipe(timeout(8000)),
    );
  }

  @Get('talents/:id')
  @Public()
  @ApiOperation({
    summary: 'Get talent profile detail',
    description: 'Public — no login required. Returns full approved talent profile.',
  })
  @ApiParam({ name: 'id', description: 'Talent profile UUID' })
  getTalent(@Param('id') id: string) {
    return firstValueFrom(
      this.marketplaceClient
        .send(MARKETPLACE_PATTERNS.GET_TALENT, { talent_id: id })
        .pipe(timeout(5000)),
    );
  }

  // ── Protected routes — login required ────────────────────────────────

  @Get('cart')
  @ApiOperation({ summary: 'Get my cart' })
  getCart(@CurrentUser() user: UserPayload) {
    return firstValueFrom(
      this.marketplaceClient
        .send(MARKETPLACE_PATTERNS.GET_CART, { user_id: user.sub })
        .pipe(timeout(5000)),
    );
  }

  @Post('cart')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Add talent to cart' })
  addToCart(@Body() body: Record<string, unknown>, @CurrentUser() user: UserPayload) {
    return firstValueFrom(
      this.marketplaceClient
        .send(MARKETPLACE_PATTERNS.ADD_TO_CART, { ...body, user_id: user.sub })
        .pipe(timeout(5000)),
    );
  }

  @Delete('cart/:itemId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Remove item from cart' })
  @ApiParam({ name: 'itemId', description: 'Cart item UUID' })
  removeFromCart(@Param('itemId') itemId: string, @CurrentUser() user: UserPayload) {
    return firstValueFrom(
      this.marketplaceClient
        .send(MARKETPLACE_PATTERNS.REMOVE_FROM_CART, {
          cart_item_id: itemId,
          user_id: user.sub,
        })
        .pipe(timeout(5000)),
    );
  }

  @Get('wishlist')
  @ApiOperation({ summary: 'Get my wishlist' })
  getWishlist(@CurrentUser() user: UserPayload) {
    return firstValueFrom(
      this.marketplaceClient
        .send(MARKETPLACE_PATTERNS.GET_WISHLIST, { user_id: user.sub })
        .pipe(timeout(5000)),
    );
  }

  @Post('wishlist')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Add talent to wishlist' })
  addToWishlist(@Body() body: Record<string, unknown>, @CurrentUser() user: UserPayload) {
    return firstValueFrom(
      this.marketplaceClient
        .send(MARKETPLACE_PATTERNS.ADD_TO_WISHLIST, { ...body, user_id: user.sub })
        .pipe(timeout(5000)),
    );
  }

  @Delete('wishlist/:talentId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Remove talent from wishlist' })
  @ApiParam({ name: 'talentId', description: 'Talent profile UUID' })
  removeFromWishlist(@Param('talentId') talentId: string, @CurrentUser() user: UserPayload) {
    return firstValueFrom(
      this.marketplaceClient
        .send(MARKETPLACE_PATTERNS.REMOVE_FROM_WISHLIST, {
          talent_id: talentId,
          user_id: user.sub,
        })
        .pipe(timeout(5000)),
    );
  }
}