import { registerAs } from '@nestjs/config';

export default registerAs('storage', () => ({
  provider: process.env['STORAGE_PROVIDER'] ?? 'local',
  // Azure Blob Storage
  azureConnectionString: process.env['AZURE_STORAGE_CONNECTION_STRING'] ?? '',
  azureContainer: process.env['AZURE_STORAGE_CONTAINER'] ?? 'outtask-media',
  // S3 compatible
  s3Endpoint: process.env['S3_ENDPOINT'] ?? '',
  s3AccessKey: process.env['S3_ACCESS_KEY'] ?? '',
  s3SecretKey: process.env['S3_SECRET_KEY'] ?? '',
  s3Bucket: process.env['S3_BUCKET'] ?? '',
  // Local (dev only)
  localUploadDir: process.env['LOCAL_UPLOAD_DIR'] ?? './uploads',
  localPublicUrl: process.env['LOCAL_PUBLIC_URL'] ?? 'http://localhost:3000/uploads',
}));
