import { IsEnum, IsInt, IsNotEmpty, IsObject, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { SectionType } from '@prisma/client';

export class CreateSectionDto {
  @ApiProperty({ enum: SectionType, description: 'Section type' })
  @IsEnum(SectionType)
  @IsNotEmpty()
  type!: SectionType;

  @ApiProperty({ description: 'Display order within the page', minimum: 0 })
  @IsInt()
  @Min(0)
  order!: number;

  @ApiProperty({ description: 'Section configuration (JSON)', type: 'object', additionalProperties: true })
  @IsObject()
  config!: Record<string, unknown>;
}
