import { InputType, Field } from '@nestjs/graphql'; 
import { Type } from 'class-transformer';
import { IsInt, IsNumber, IsOptional, IsString, Min } from 'class-validator';

@InputType() 
export class CreateProductInput {
  
  @Field()
  @IsString()
  name: string;

  @Field({ nullable: true }) 
  @IsOptional()
  @IsString()
  description?: string;

  @Field()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  price: number;

  @Field()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  inStockCount: number;

  @Field()  
  @IsString()
  categoryId: string;
}
