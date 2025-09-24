import { Test, TestingModule } from '@nestjs/testing';
import { AsyncClassifierService } from './async-classifier.consumer';

describe('AsyncClassifierService', () => {
  let service: AsyncClassifierService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AsyncClassifierService],
    }).compile();

    service = module.get<AsyncClassifierService>(AsyncClassifierService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
