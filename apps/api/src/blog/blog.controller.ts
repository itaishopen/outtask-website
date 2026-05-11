import {
  Controller, Get, Post, Patch, Delete, Param, Body, Query, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ContentStatus } from '@prisma/client';
import { BlogService } from './blog.service';
import { CreateBlogPostDto } from './dto/create-blog-post.dto';
import { UpdateBlogPostDto } from './dto/update-blog-post.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser, AuthUser } from '../common/decorators/current-user.decorator';

@ApiTags('Blog')
@ApiBearerAuth()
@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Get()
  @Roles('ADMIN', 'EDITOR', 'VIEWER')
  @ApiOperation({ summary: 'List blog posts (paginated, filterable by status)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'status', required: false, enum: ContentStatus })
  findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 20,
    @Query('status') status?: ContentStatus,
  ) {
    return this.blogService.findAll(Number(page), Number(limit), status);
  }

  @Get(':id')
  @Roles('ADMIN', 'EDITOR', 'VIEWER')
  @ApiOperation({ summary: 'Get a blog post by ID' })
  findOne(@Param('id') id: string) {
    return this.blogService.findOne(id);
  }

  @Post()
  @Roles('ADMIN', 'EDITOR')
  @ApiOperation({ summary: 'Create a blog post' })
  create(@Body() dto: CreateBlogPostDto, @CurrentUser() user: AuthUser) {
    return this.blogService.create(dto, user.id);
  }

  @Patch(':id')
  @Roles('ADMIN', 'EDITOR')
  @ApiOperation({ summary: 'Update a blog post' })
  update(@Param('id') id: string, @Body() dto: UpdateBlogPostDto, @CurrentUser() user: AuthUser) {
    return this.blogService.update(id, dto, user.id);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a blog post (ADMIN only)' })
  remove(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.blogService.remove(id, user.id);
  }

  @Post(':id/publish')
  @Roles('ADMIN', 'EDITOR')
  @ApiOperation({ summary: 'Publish a blog post' })
  publish(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.blogService.publish(id, user.id);
  }

  @Post(':id/unpublish')
  @Roles('ADMIN', 'EDITOR')
  @ApiOperation({ summary: 'Unpublish a blog post (revert to draft)' })
  unpublish(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.blogService.unpublish(id, user.id);
  }
}
