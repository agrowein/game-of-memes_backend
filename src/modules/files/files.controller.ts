import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  UploadedFiles,
  UseInterceptors,
  StreamableFile,
  Res
} from '@nestjs/common';
import { FilesService } from './files.service';
import { CreateFileDto } from './dto/create-file.dto';
import { FilesInterceptor } from "@nestjs/platform-express";
import multer, { diskStorage } from 'multer';
import { createReadStream } from "fs";
import { join } from "lodash";
import * as fs from "fs";
import { Buffer } from "buffer";

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  @UseInterceptors(
    FilesInterceptor('files', 20, {
      storage: diskStorage({
        destination: './uploads/',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
          callback(null, file.fieldname + '-' + uniqueSuffix + '.jpg');
        },
      }),
      //   fileFilter: imageFileFilter,
    }),
  )
  uploadMultipleFiles(@UploadedFiles() files) {
    const response = [];
    files.forEach(file => {
      const fileReponse = {
        filename: file.filename,
      };
      response.push(fileReponse);
    });
    return response;
  }

  @Get(':filename')
  async getFile(@Param('filename') filename: string, @Res() res) {
    const file = createReadStream(`${process.cwd()}\\uploads\\${filename}`);
    res.send({
      // @ts-ignore
      image: Buffer.from(file, 'binary').toString('base64'),
      extension: 'base64',
    });
  }

}
