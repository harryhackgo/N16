import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";

@Injectable()
export class FileSizeValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
      const maxSize = 5 * 1024 * 1024; 
      if (value?.size > maxSize) {
          throw new Error('File size exceeds the maximum limit of 5MB');
      }
      return value;
  }
}