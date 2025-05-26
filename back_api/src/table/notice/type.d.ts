import { User } from '@/prisma/client/postgresql';

interface BaseNoticeDto {
  title: string;
  type: string;
  content: string;
  recipients: number[];
  isPublished: boolean;
}

type createNoticeDto = BaseNoticeDto & {
  creatorId: number;
  isPublished: boolean;
};

type updateNoticeDto = BaseNoticeDto & {
  id: number;
  creatorId: number;
  creator: User;
};
