export type Staticfile = {
  filename: string;
  filepath: string;
  uploaderId: number | null;
  uploader: string | null;
  extension: string | null;
  name: string;
  remark: string;
  sha256: string;
  size: number;
  url: string;
};
