import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';

import { UsersModule } from './users/users.module';
import { WorkersModule } from './workers/workers.module';
import { CacheModule } from '@nestjs/cache-manager';
import { WorkerProficienciesModule } from './worker-proficiencies/workerproficiencies.module';
import { ToolsModule } from './tools/tools.module';
import { SizesModule } from './sizes/sizes.module';
import { ShowcasesModule } from './showcases/showcases.module';
import { RegionsModule } from './regions/regions.module';
import { ProficienciesModule } from './proficency/proficencies.module';
import { PaymentMethodsModule } from './payment-method/payment-methods.module';
import { PartnersModule } from './partners/partners.module';
import { OrdersModule } from './orders/orders.module';
import { OrderWorkersModule } from './order-worker/order-workers.module';
import { OrderToolsModule } from './order-tools/order-tools.module';
import { LevelsModule } from './levels/levels.module';
import { GeneralsModule } from './generals/generals.module';
import { FavoritesModule } from './favorites/favorites.module';
import { FavItemsModule } from './favitems/favitems.module';
import { FaqsModule } from './faqs/faqs.module';
import { ContactsModule } from './contacts/categories.module';
import { CompaniesModule } from './companies/companies.module';
import { CommentsModule } from './comments/comments.module';
import { CommentWorkersModule } from './comment-workers/comment-workers.module';
import { CardsModule } from './cards/cards.module';
import { CapacitiesModule } from './capacities/capacities.module';
import { BrandsModule } from './brands/brands.module';
import { AuthModule } from './auth/auth.module';
import { AttachedWorkersModule } from './attached-workers/attached-workers.module';
import { AdminsModule } from './admins/admins.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './guards/auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    CacheModule.register({isGlobal: true}),
    AuthModule,
    AdminsModule,
    UsersModule,
    RegionsModule,
    CompaniesModule,
    FavoritesModule,
    FavItemsModule,
    CardsModule,
    WorkersModule,
    LevelsModule,
    ProficienciesModule,
    WorkerProficienciesModule,
    CommentsModule,
    CommentWorkersModule,
    ToolsModule,
    SizesModule,
    BrandsModule,
    CapacitiesModule,
    OrdersModule,
    OrderWorkersModule,
    OrderToolsModule,
    AttachedWorkersModule,
    PaymentMethodsModule,
    PartnersModule,
    GeneralsModule,
    FaqsModule,
    ContactsModule,
    ShowcasesModule,
  ],
  controllers: [AppController],
  providers: [AppService, 
    {
    provide: APP_GUARD,
    useClass: AuthGuard,
  },
],
})
export class AppModule {}
