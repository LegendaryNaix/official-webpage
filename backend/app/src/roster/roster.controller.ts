import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { Public, Roles } from '@libs/decorator'
import { BusinessExceptionHandler } from '@libs/exception'
import { IMAGE_OPTIONS } from '@libs/storage'
import { Role, type Roster } from '@prisma/client'
import { CreateRosterDTO, type UpdateRosterDTO } from './dto/roster.dto'
import { RosterService } from './roster.service'

@Controller('rosters')
export class RosterController {
  constructor(private readonly rosterService: RosterService) {}

  @Public()
  @Get()
  async getRosters(
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
    @Query('filter') filter?: string,
    @Query('searchTerm') searchTerm?: string
  ): Promise<{ total: number; rosters: Roster[] }> {
    try {
      return await this.rosterService.getRosters(
        page,
        limit,
        searchTerm,
        filter
      )
    } catch (error) {
      BusinessExceptionHandler(error)
    }
  }

  @Public()
  @Get(':rosterId')
  async getRoster(
    @Param('rosterId', ParseIntPipe) rosterId: number
  ): Promise<Roster> {
    try {
      return await this.rosterService.getRoster(rosterId)
    } catch (error) {
      BusinessExceptionHandler(error)
    }
  }

  @Public()
  @Get('studentId/:studentId')
  async getRostersByStudentId(
    @Param('studentId') studentId: string
  ): Promise<Roster> {
    try {
      return await this.rosterService.getRosterByStudentId(studentId)
    } catch (error) {
      BusinessExceptionHandler(error)
    }
  }

  @Roles(Role.Admin)
  @Put(':rosterId')
  async updateRoster(
    @Param('rosterId', ParseIntPipe) rosterId: number,
    @Body() rosterDTO: UpdateRosterDTO
  ): Promise<Roster> {
    try {
      return await this.rosterService.updateRoster(rosterId, rosterDTO)
    } catch (error) {
      BusinessExceptionHandler(error)
    }
  }

  @Roles(Role.Admin)
  @UseInterceptors(FileInterceptor('image', IMAGE_OPTIONS))
  @Put(':rosterId/profile-image')
  async updateRosterProfileImage(
    @Param('rosterId', ParseIntPipe) rosterId: number,
    @UploadedFile() image: Express.Multer.File
  ): Promise<Roster> {
    if (!image) {
      throw new BadRequestException('Invalid image format or size')
    }

    try {
      return await this.rosterService.updateRosterProfileImage(rosterId, image)
    } catch (error) {
      BusinessExceptionHandler(error)
    }
  }

  @Roles(Role.Admin)
  @Delete(':rosterId')
  async deleteRoster(
    @Param('rosterId', ParseIntPipe) rosterId: number
  ): Promise<Roster> {
    try {
      return await this.rosterService.deleteRoster(rosterId)
    } catch (error) {
      BusinessExceptionHandler(error)
    }
  }

  @Roles(Role.Admin)
  @Post()
  async createRoster(@Body() rosterDTO: CreateRosterDTO): Promise<Roster> {
    try {
      return await this.rosterService.createRoster(rosterDTO)
    } catch (error) {
      BusinessExceptionHandler(error)
    }
  }
}
