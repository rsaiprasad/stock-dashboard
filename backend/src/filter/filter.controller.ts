import { Controller } from '@nestjs/common';
import { FilterService } from './filter.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('filters')
@Controller('filters')
export class FilterController {
  constructor(private readonly filterService: FilterService) {}

  // This will be implemented in Phase 3
}
